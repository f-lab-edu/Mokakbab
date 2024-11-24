import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { ParticipationEntity } from "@APP/entities/participation.entity";

@Injectable()
export class ParticipationRepository extends Repository<ParticipationEntity> {
    constructor(
        @InjectRepository(ParticipationEntity)
        private readonly repository: Repository<ParticipationEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<ParticipationEntity>(ParticipationEntity)
            : this.repository;
    }
}
