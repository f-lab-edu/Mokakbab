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

    async createMember(dto: RegisterMemberDto) {
        const emailExists = await this.membersRepository.exist({
            where: {
                email: dto.email,
            },
        });

        if (emailExists) {
            throw new BadRequestException("이미 가입한 이메일입니다");
        }

        const newMember = this.membersRepository.create(dto);

        return await this.membersRepository.save(newMember);
    }
}
