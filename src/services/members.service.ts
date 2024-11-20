import { Injectable } from "@nestjs/common";

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
}
