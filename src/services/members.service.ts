import { BadRequestException, Injectable } from "@nestjs/common";

import { RegisterMemberDto } from "@APP/dtos/register-member.dto";
import { MembersRepository } from "@APP/repositories/members.repository";

@Injectable()
export class MembersService {
    constructor(private readonly membersRepository: MembersRepository) {}

    async findByEmail(email: string) {
        return this.membersRepository.findOne({
            where: {
                email,
            },
        });
    }

    async createMember(dto: RegisterMemberDto, verificationCode: string) {
        const emailExists = await this.membersRepository.exists({
            where: {
                email: dto.email,
            },
        });

        if (emailExists) {
            throw new BadRequestException("이미 가입한 이메일입니다");
        }

        const newMember = this.membersRepository.create({
            ...dto,
            verificationCode,
        });

        return await this.membersRepository.save(newMember);
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
