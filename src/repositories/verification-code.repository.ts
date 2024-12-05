import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { VerificationCodeEntity } from "@APP/entities/verification-code.entity";

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
}
