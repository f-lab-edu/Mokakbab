import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { VerificationCodeEntity } from "@APP/entities/verification-code.entity";

@Injectable()
export class VerificationCodeRepository extends Repository<VerificationCodeEntity> {
    constructor(
        @InjectRepository(VerificationCodeEntity)
        private readonly repository: Repository<VerificationCodeEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<VerificationCodeEntity>(
                  VerificationCodeEntity,
              )
            : this.repository;
    }

    async saveVerificationCode(code: string, queryRunner?: QueryRunner) {
        const insertResult = await this.getRepository(queryRunner)
            .createQueryBuilder()
            .insert()
            .into(VerificationCodeEntity)
            .updateEntity(false)
            .values({ code })
            .useTransaction(true)
            .execute();

        return insertResult.raw.insertId;
    }
}
