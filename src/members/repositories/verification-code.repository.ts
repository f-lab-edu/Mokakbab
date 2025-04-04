import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { VerificationCodeEntity } from "../entities/verification-code.entity";

@Injectable()
export class VerificationCodeRepository extends Repository<VerificationCodeEntity> {
    constructor(
        @InjectRepository(VerificationCodeEntity)
        private readonly repository: Repository<VerificationCodeEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async saveVerificationCode(code: string) {
        const insertResult = await this.repository
            .createQueryBuilder()
            .insert()
            .into(VerificationCodeEntity)
            .updateEntity(false)
            .values({ code })
            .execute();

        return insertResult.raw.insertId;
    }
}
