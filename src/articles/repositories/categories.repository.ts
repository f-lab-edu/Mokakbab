import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { CategoryEntity } from "../entities/category.entity";

@Injectable()
export class CategoriesRepository extends Repository<CategoryEntity> {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly repository: Repository<CategoryEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<CategoryEntity>(CategoryEntity)
            : this.repository;
    }
}
