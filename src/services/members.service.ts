import { BadRequestException, Injectable } from "@nestjs/common";

import { RegisterMemberDto } from "@APP/dtos/register-member.dto";
import { MembersRepository } from "@APP/repositories/members.repository";

@Injectable()
export class MembersService {
    constructor(private readonly membersRepository: MembersRepository) {}

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
        return this.membersRepository.exist({
            where: {
                email,
            },
        });
    }
}
