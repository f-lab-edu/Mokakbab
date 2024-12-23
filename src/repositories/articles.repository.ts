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

    findAllV2(cursor: number, limit: number = 10) {
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
                'COUNT(like.articleId) AS "likeCount"',
            ])
            .leftJoin("article.articleLikes", "like")
            .where(cursor ? "article.id < :cursor" : "1=1", { cursor })
            .orderBy("article.id", "DESC")
            .limit(limit + 1);

        return query.getRawMany();
    }
}
