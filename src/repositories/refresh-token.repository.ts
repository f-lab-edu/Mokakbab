import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {
    constructor(
        @InjectRepository(RefreshTokenEntity)
        private readonly repository: Repository<RefreshTokenEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<RefreshTokenEntity>(RefreshTokenEntity)
            : this.repository;
    }
}
