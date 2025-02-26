import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { ArticleEntity } from "@APP/entities/article.entity";

@Injectable()
export class ArticlesRepository extends Repository<ArticleEntity> {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly repository: Repository<ArticleEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<ArticleEntity>(ArticleEntity)
            : this.repository;
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

    async findAllV2(
        currentMemberId: number,
        cursor: number,
        limit: number = 10,
    ): Promise<any[]> {
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

        const [likeCounts, participantCounts, likedArticles] =
            await Promise.all([
                this.repository.query(
                    `
                SELECT 
                    articleId,
                    COUNT(*) as "likeCount"
                FROM article_likes
                WHERE articleId IN (?)
                GROUP BY articleId
                `,
                    [articleIds],
                ),
                this.repository.query(
                    `
                SELECT 
                    articleId,
                    COUNT(*) as "participantCount"
                FROM participation
                WHERE status = 'ACTIVE' AND articleId IN (?)
                GROUP BY articleId
                `,
                    [articleIds],
                ),
                this.repository.query(
                    `
                SELECT DISTINCT articleId
                FROM article_likes
                WHERE memberId = ? AND articleId IN (?)
                `,
                    [currentMemberId, articleIds],
                ),
            ]);

        return articles.map((article: { articleId: number }) => ({
            ...article,
            likeCount:
                likeCounts.find(
                    (lc: { articleId: number }) =>
                        lc.articleId === article.articleId,
                )?.likeCount || 0,
            participantCount:
                participantCounts.find(
                    (pc: { articleId: number }) =>
                        pc.articleId === article.articleId,
                )?.participantCount || 0,
            isLiked: likedArticles.some(
                (la: { articleId: number }) =>
                    la.articleId === article.articleId,
            ),
        }));
    }
}
