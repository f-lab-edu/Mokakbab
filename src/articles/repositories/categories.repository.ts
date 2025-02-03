import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CategoryEntity } from "../entities/category.entity";

@Injectable()
export class CategoriesRepository extends Repository<CategoryEntity> {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly repository: Repository<CategoryEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    existsById(id: number) {
        return this.repository.exists({ where: { id } });
    }
}
