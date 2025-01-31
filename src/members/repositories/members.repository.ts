import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RegisterMemberDto } from "../dtos/register-member.dto";
import { UpdateMemberDto } from "../dtos/update-member.dto";
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

    async verifyCodeByEmail(email: string, verificationCode: string) {
        const result = await this.repository
            .createQueryBuilder("member")
            .leftJoin("member.verificationCode", "verificationCode")
            .where("member.email = :email", { email })
            .andWhere("verificationCode.code = :verificationCode", {
                verificationCode,
            })
            .getCount();

        return result > 0;
    }

    updateEmailVerified(email: string) {
        return this.repository.update(
            {
                email,
            },
            {
                isEmailVerified: true,
            },
        );
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

    findByEmail(email: string) {
        return this.repository
            .createQueryBuilder("member")
            .select([
                "member.id",
                "member.email",
                "member.password",
                "member.isEmailVerified",
            ])
            .where("member.email = :email", { email })
            .getOne();
    }

    findById(memberId: number) {
        return this.repository
            .createQueryBuilder("member")
            .select([
                "member.id",
                "member.email",
                "member.name",
                "member.nickname",
                "member.profileImage",
            ])
            .where("member.id = :memberId", { memberId })
            .getOne();
    }

    findMemberWithRefreshTokenByEmail(email: string) {
        return this.repository
            .createQueryBuilder("member")
            .leftJoinAndSelect("member.refreshToken", "refreshToken")
            .select(["member.id", "member.email", "refreshToken.token"])
            .where("member.email = :email", { email })
            .getOne();
    }

    updateById(dto: UpdateMemberDto) {
        return this.repository.update(
            { id: dto.id },
            {
                email: dto.email,
                name: dto.name,
                nickname: dto.nickname,
                password: dto.password,
            },
        );
    }

    deleteById(memberId: number) {
        return this.repository.delete({
            id: memberId,
        });
    }

    updateProfileImage(memberId: number, filename: string) {
        return this.repository.update(
            { id: memberId },
            { profileImage: filename },
        );
    }
}
