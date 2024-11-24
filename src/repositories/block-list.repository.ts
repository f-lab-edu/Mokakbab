import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { BlockListEntity } from "@APP/entities/block-list.entity";

export class BlockListRepository extends Repository<BlockListEntity> {
    constructor(
        @InjectRepository(BlockListEntity)
        private readonly repository: Repository<BlockListEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getMembersRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<BlockListEntity>(BlockListEntity)
            : this.repository;
    }
}
