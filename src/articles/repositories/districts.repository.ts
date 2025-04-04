import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DistrictEntity } from "../entities/district.entity";

@Injectable()
export class DistrictsRepository extends Repository<DistrictEntity> {
    constructor(
        @InjectRepository(DistrictEntity)
        private readonly repository: Repository<DistrictEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    existsById(id: number) {
        return this.repository.exists({ where: { id } });
    }
}
