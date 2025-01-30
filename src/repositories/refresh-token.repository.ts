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

    updateRefreshToken(refreshTokenId: number, refreshToken: string) {
        return this.repository.update(
            {
                id: refreshTokenId,
            },
            {
                token: refreshToken,
            },
        );
    }

    async saveRefreshToken(refreshToken: string) {
        const insertResult = await this.repository
            .createQueryBuilder()
            .insert()
            .into(RefreshTokenEntity)
            .updateEntity(false)
            .values({ token: refreshToken })
            .useTransaction(true)
            .execute();

        return insertResult.raw.insertId;
    }
}
