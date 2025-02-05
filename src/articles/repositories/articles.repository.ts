import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateArticleDto } from "../dtos/create-article.dto";
import { UpdateArticleDto } from "../dtos/update-article.dto";
import { ArticleEntity } from "../entities/article.entity";

@Injectable()
export class ArticlesRepository extends Repository<ArticleEntity> {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly repository: Repository<ArticleEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    findById(articleId: number) {
        return this.repository.query(
            `
            SELECT 
                article.id AS article_id,
                article.title AS article_title,
                article.startTime AS article_startTime,
                article.endTime AS article_endTime,
                article.articleImage AS article_articleImage,
                article.createdAt AS article_createdAt,
                article.updatedAt AS article_updatedAt
            FROM articles article
            WHERE article.id = ?
        `,
            [articleId],
        );
    }

    findAllV1(currentMemberId: number, cursor: number, limit: number = 10) {
        // 해당 아티클의 좋아요 총갯수
        // 모각밥 참여자 갯수
        // 내가 해당 아티클 좋아요 여부
        // 지역, 음식 카테고리, 멤버 테이블(글쓴사람)과 조인하여 해당 칼럼들 가져오기
        const query = this.repository
            .createQueryBuilder("article")
            .select([
                'article.id AS "articleId"',
                'article.title AS "title"',
                'article.content AS "content"',
                'article.startTime AS "startTime"',
                'article.endTime AS "endTime"',
                'article.articleImage AS "articleImage"',
                'article.createdAt AS "createdAt"',
                'article.updatedAt AS "updatedAt"',
                'member.id AS "memberId"',
                'member.name AS "memberName"',
                'member.nickname AS "memberNickname"',
                'member.profileImage AS "memberProfileImage"',
                'category.id AS "categoryId"',
                'category.name AS "categoryName"',
                'region.id AS "regionId"',
                'region.name AS "regionName"',
                'district.id AS "districtId"',
                'district.name AS "districtName"',
            ])
            .addSelect((qb) => {
                return qb
                    .select("COUNT(*)")
                    .from("article_likes", "al")
                    .where("al.articleId = article.id");
            }, "likeCount")
            .addSelect((qb) => {
                return qb
                    .select("COUNT(*)")
                    .from("participation", "p")
                    .where("p.articleId = article.id")
                    .andWhere("p.status = :status", { status: "ACTIVE" });
            }, "participantCount")
            .addSelect((qb) => {
                return qb
                    .select("CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END")
                    .from("article_likes", "al")
                    .where("al.articleId = article.id")
                    .andWhere("al.memberId = :currentMemberId", {
                        currentMemberId,
                    });
            }, "isLiked")
            .innerJoin("article.member", "member")
            .innerJoin("article.category", "category")
            .innerJoin("article.region", "region")
            .innerJoin("article.district", "district")
            .where(cursor ? "article.id < :cursor" : "1=1", { cursor })
            .orderBy("article.id", "DESC")
            .limit(limit + 1);

        return query.getRawMany();
    }

    async findAllV2(cursor: number, limit: number = 10): Promise<any[]> {
        const articles = await this.repository.query(
            `
        WITH filtered_articles AS (
            SELECT id
            FROM articles
            WHERE id < ?
            ORDER BY id DESC
            LIMIT ?
        )
        SELECT
            article.id                     AS "articleId",
            article.title                  AS "title",
            article.content                AS "content",
            article.startTime              AS "startTime",
            article.endTime                AS "endTime",
            article.articleImage           AS "articleImage",
            article.createdAt              AS "createdAt",
            article.updatedAt              AS "updatedAt",
            article.articleLikeCount       AS "articleLikeCount",
            member.id                      AS "memberId",
            member.name                    AS "memberName",
            member.nickname                AS "memberNickname",
            member.profileImage            AS "memberProfileImage",
            category.id                    AS "categoryId",
            category.name                  AS "categoryName",
            region.id                      AS "regionId",
            region.name                    AS "regionName",
            district.id                    AS "districtId",
            district.name                  AS "districtName"
        FROM 
            filtered_articles fa
            JOIN articles article ON article.id = fa.id
            INNER JOIN member ON member.id = article.memberId
            INNER JOIN category ON category.id = article.categoryId
            INNER JOIN region ON region.id = article.regionId
            INNER JOIN district ON district.id = article.districtId
        ORDER BY article.id DESC
    `,
            [cursor, limit],
        );

        const articleIds = articles.map(
            (article: { articleId: number }) => article.articleId,
        );

        const participantCounts = await this.repository.query(
            `
            SELECT 
                articleId,
                COUNT(*) as "participantCount"
            FROM participation
            WHERE status = 'ACTIVE' AND articleId IN (?)
            GROUP BY articleId
            `,
            [articleIds],
        );

        return articles.map((article: { articleId: number }) => ({
            ...article,
            participantCount:
                participantCounts.find(
                    (pc: { articleId: number }) =>
                        pc.articleId === article.articleId,
                )?.participantCount || 0,
        }));
    }

    createArticle(article: CreateArticleDto, memberId: number) {
        return this.repository
            .createQueryBuilder()
            .insert()
            .into(ArticleEntity)
            .updateEntity(false)
            .values({
                memberId,
                ...article,
            })
            .useTransaction(true)
            .execute();
    }

    updateByArticleId(articleId: number, updateArticleDto: UpdateArticleDto) {
        return this.repository.update(
            {
                id: articleId,
            },
            updateArticleDto,
        );
    }

    findOneByArticleId(articleId: number) {
        return this.repository.findOne({
            select: {
                id: true,
                memberId: true,
            },
            where: {
                id: articleId,
            },
        });
    }

    deleteByArticleId(articleId: number) {
        return this.repository.delete(articleId);
    }
}
