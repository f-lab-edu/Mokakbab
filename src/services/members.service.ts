import { Injectable } from "@nestjs/common";

import { RegisterMemberDto } from "@APP/dtos/register-member.dto";
import { MembersRepository } from "@APP/repositories/members.repository";
import { RefreshTokenRepository } from "@APP/repositories/refresh-token.repository";

@Injectable()
export class MembersService {
    constructor(
        private readonly membersRepository: MembersRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) {}

    findByEmail(email: string) {
        return this.membersRepository.findOne({
            where: {
                email,
            },
        });
    }

    createMember(dto: RegisterMemberDto) {
        const newMember = this.membersRepository.create(dto);

        return this.membersRepository.save(newMember);
    }

    existByEmail(email: string) {
        return this.membersRepository.exists({
            where: {
                email,
            },
        });
    }

    findOneByEmail(email: string) {
        return this.membersRepository.findOne({
            where: {
                email,
            },
            relations: {
                refreshToken: true,
            },
        });
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
        const foundMember = await this.membersRepository.findOneOrFail({
            where: {
                id: memberId,
            },
            relations: {
                refreshToken: true,
            },
        });

        if (foundMember.refreshToken?.token) {
            return this.refreshTokenRepository.update(
                {
                    id: foundMember.refreshToken.id,
                },
                {
                    token: refreshToken,
                },
            );
        }

        const newRefreshToken = this.refreshTokenRepository.create({
            token: refreshToken,
        });

        const savedRefreshToken =
            await this.refreshTokenRepository.save(newRefreshToken);

        return this.membersRepository.update(
            {
                id: memberId,
            },
            {
                refreshToken: {
                    id: savedRefreshToken.id,
                },
            },
        );
    }

    async findOneByEmail(email: string) {
        return this.membersRepository.findOne({
            where: {
                email,
            },
        });
    }

    async updateRefreshToken(memberId: number) {
        return await this.membersRepository.update(
            {
                id: memberId,
            },
            {
                refreshToken: null,
            },
        );
    }
}
