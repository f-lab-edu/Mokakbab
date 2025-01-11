import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";

import { RegisterMemberDto } from "@APP/dtos/register-member.dto";
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

    async existByEmail(email: string) {
        const result = await this.repository
            .createQueryBuilder("member")
            .where("member.email = :email", { email })
            .getCount();

        return result > 0;
    }

    async createMember(
        dto: RegisterMemberDto,
        verificationCodeId: number,
        queryRunner?: QueryRunner,
    ): Promise<Pick<MemberEntity, "id" | "email">> {
        const insertResult = await this.getRepository(queryRunner)
            .createQueryBuilder()
            .insert()
            .into(MemberEntity)
            .updateEntity(false)
            .values({ ...dto, verificationCode: { id: verificationCodeId } })
            .useTransaction(false)
            .execute();

        return {
            id: insertResult.raw.insertId,
            email: dto.email,
        };
    }

    findMemberWithRefreshTokenId(
        memberId: number,
    ): Promise<Pick<MemberEntity, "refreshTokenId">> {
        return this.repository
            .createQueryBuilder("member")
            .select(["member.id", "member.refreshTokenId"])
            .where("member.id = :memberId", { memberId })
            .getOneOrFail();
    }

    updateMember(memberId: number, member: Partial<MemberEntity>) {
        return this.repository.update({ id: memberId }, { ...member });
    }
}
