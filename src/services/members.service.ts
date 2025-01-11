import { Injectable } from "@nestjs/common";
import { QueryRunner } from "typeorm";

import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { MemberErrorCode } from "@APP/common/exception/error-code";
import { RegisterMemberDto } from "@APP/dtos/register-member.dto";
import { UpdateMemberDto } from "@APP/dtos/update-member.dto";
import { VerifyEmailDto } from "@APP/dtos/verify-email.dto";
import { BlackListRepository } from "@APP/repositories/black-list.repository";
import { MembersRepository } from "@APP/repositories/members.repository";
import { RefreshTokenRepository } from "@APP/repositories/refresh-token.repository";
import { VerificationCodeRepository } from "@APP/repositories/verification-code.repository";

@Injectable()
export class MembersService {
    constructor(
        private readonly membersRepository: MembersRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly verificationCodeRepository: VerificationCodeRepository,
        private readonly blackListRepository: BlackListRepository,
    ) {}

    findByEmail(email: string) {
        return this.membersRepository.findOne({
            where: {
                email,
            },
        });
    }

    findById(memberId: number) {
        return this.membersRepository.findOne({
            where: {
                id: memberId,
            },
        });
    }

    updateById(memberId: number, dto: UpdateMemberDto) {
        return this.membersRepository.update(
            {
                id: memberId,
            },
            dto,
        );
    }

    deleteById(memberId: number) {
        return this.membersRepository.delete({
            id: memberId,
        });
    }

    async verifyEmail(dto: VerifyEmailDto) {
        const member = await this.findByEmail(dto.email);

        if (member?.isEmailVerified) return true;

        const verifyCodeExists = await this.membersRepository.exists({
            where: {
                email: dto.email,
                verificationCode: {
                    code: dto.verificationCode,
                },
            },
            relations: {
                verificationCode: true,
            },
        });

        if (!verifyCodeExists) {
            throw new BusinessErrorException(
                MemberErrorCode.INVALID_VERIFICATION_CODE,
            );
        }

        await this.membersRepository.update(
            {
                email: dto.email,
            },
            {
                isEmailVerified: true,
            },
        );
        return verifyCodeExists;
    }

    async createMember(
        dto: RegisterMemberDto,
        verificationCode: string,
        queryRunner?: QueryRunner,
    ) {
        const savedVerificationCode =
            await this.verificationCodeRepository.saveVerificationCode(
                verificationCode,
                queryRunner,
            );

        const member = await this.membersRepository.createMember(
            dto,
            savedVerificationCode,
            queryRunner,
        );

        return member;
    }

    existByEmail(email: string) {
        return this.membersRepository.existByEmail(email);
    }

    findOneByEmail(email: string) {
        return this.membersRepository
            .createQueryBuilder("member")
            .leftJoinAndSelect("member.refreshToken", "refreshToken")
            .select(["member.id", "member.email", "refreshToken.token"])
            .where("member.email = :email", { email })
            .getOne();
    }

    async updateRefreshToken(memberId: number) {
        const foundMember = await this.membersRepository.findOneOrFail({
            where: {
                id: memberId,
            },
            relations: {
                refreshToken: true,
            },
        });

        return this.refreshTokenRepository.update(
            {
                id: foundMember.refreshToken!.id,
            },
            {
                token: null,
            },
        );
    }

    async saveRefreshToken(memberId: number, refreshToken: string) {
        const { refreshTokenId } =
            await this.membersRepository.findMemberWithRefreshTokenId(memberId);

        if (refreshTokenId) {
            return this.refreshTokenRepository.updateRefreshToken(
                refreshTokenId,
                refreshToken,
            );
        }

        const savedRefreshToken =
            await this.refreshTokenRepository.saveRefreshToken(refreshToken);

        return this.membersRepository.updateMember(memberId, {
            refreshTokenId: savedRefreshToken,
        });
    }

    updateProfileImage(memberId: number, filename: string) {
        return this.membersRepository.update(
            { id: memberId },
            { profileImage: filename },
        );
    }

    findBlacks(memberId: number) {
        return this.blackListRepository.find({
            where: {
                blackerId: memberId,
            },
        });
    }

    createBlack(blackerId: number, blackedId: number) {
        return this.blackListRepository.save({
            blackerId,
            blackedId,
        });
    }

    deleteBlack(blackerId: number, blackedId: number) {
        return this.blackListRepository.delete({
            blackerId,
            blackedId,
        });
    }
}
