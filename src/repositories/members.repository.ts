import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { MemberEntity } from "@APP/entities/member.entity";

export class MembersRepository extends Repository<MemberEntity> {
    constructor(
        @InjectRepository(MemberEntity)
        private readonly repository: Repository<MemberEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getMembersRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<MemberEntity>(MemberEntity)
            : this.repository;
    }
}
