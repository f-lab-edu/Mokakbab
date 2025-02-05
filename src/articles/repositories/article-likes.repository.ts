import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ArticleLikeEntity } from "../entities/article-like.entity";

@Injectable()
export class ArticleLikesRepository extends Repository<ArticleLikeEntity> {
    constructor(
        @InjectRepository(ArticleLikeEntity)
        private readonly repository: Repository<ArticleLikeEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    existsByArticleIdAndMemberId(articleId: number, memberId: number) {
        return this.repository.exists({
            where: { articleId, memberId },
        });
    }

    createArticleLike(articleId: number, memberId: number) {
        return this.repository
            .createQueryBuilder()
            .insert()
            .into(ArticleLikeEntity)
            .values({ articleId, memberId })
            .execute();
    }

    deleteArticleLike(articleId: number, memberId: number) {
        return this.repository.delete({ articleId, memberId });
    }
}
