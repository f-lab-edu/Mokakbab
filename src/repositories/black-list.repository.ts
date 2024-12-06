import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { BlackListEntity } from "@APP/entities/black-list.entity";

export class BlackListRepository extends Repository<BlackListEntity> {
    constructor(
        @InjectRepository(BlackListEntity)
        private readonly repository: Repository<BlackListEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<BlackListEntity>(BlackListEntity)
            : this.repository;
    }
}
