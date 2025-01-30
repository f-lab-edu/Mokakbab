import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RegisterMemberDto } from "../dtos/register-member.dto";
import { MemberEntity } from "../entities/member.entity";

@Injectable()
export class MembersRepository extends Repository<MemberEntity> {
    constructor(
        @InjectRepository(MemberEntity)
        private readonly repository: Repository<MemberEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
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
    ): Promise<Pick<MemberEntity, "id" | "email">> {
        const insertResult = await this.repository
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

    updateMember(member: Partial<MemberEntity>) {
        return this.repository.update(
            { id: member.id },
            { refreshTokenId: member.refreshTokenId },
        );
    }
}
