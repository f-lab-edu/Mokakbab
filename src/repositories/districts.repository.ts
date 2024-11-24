import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { DistrictEntity } from "@APP/entities/district.entity";

@Injectable()
export class DistrictsRepository extends Repository<DistrictEntity> {
    constructor(
        @InjectRepository(DistrictEntity)
        private readonly repository: Repository<DistrictEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<DistrictEntity>(DistrictEntity)
            : this.repository;
    }
}
