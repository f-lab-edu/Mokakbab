import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { MemberEntity } from "@APP/entities/member.entity";

@Injectable()
export class MembersRepository extends Repository<MemberEntity> {
    constructor(
        @InjectRepository(MemberEntity)
        private readonly repository: Repository<MemberEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    getRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<MemberEntity>(MemberEntity)
            : this.repository;
    }
}
