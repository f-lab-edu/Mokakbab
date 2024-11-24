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
}
