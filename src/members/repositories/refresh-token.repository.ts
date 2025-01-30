import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RefreshTokenEntity } from "../entities/refresh-token.entity";

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {
    constructor(
        @InjectRepository(RefreshTokenEntity)
        private readonly repository: Repository<RefreshTokenEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
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
