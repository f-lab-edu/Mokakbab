import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { RegionEntity } from "../entities/region.entity";

@Injectable()
export class RegionsRepository extends Repository<RegionEntity> {
    constructor(
        @InjectRepository(RegionEntity)
        private readonly repository: Repository<RegionEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<RegionEntity>(RegionEntity)
            : this.repository;
    }
}
