import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { ArticleLikeEntity } from "@APP/entities/article-like.entity";

@Injectable()
export class ArticleLikesRepository extends Repository<ArticleLikeEntity> {
    constructor(
        @InjectRepository(ArticleLikeEntity)
        private readonly repository: Repository<ArticleLikeEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<ArticleLikeEntity>(ArticleLikeEntity)
            : this.repository;
    }
}
