import { Injectable } from "@nestjs/common";

import { CreateParticipationDto } from "@APP/dtos/create-participation.dto";
import { ParticipationsRepository } from "@APP/repositories/participations.repository";

@Injectable()
export class ParticipationsService {
    constructor(
        private readonly participationsRepository: ParticipationsRepository,
    ) {}

    createParticipation(currentMemberId: number, body: CreateParticipationDto) {
        const newParticipation = this.createParticipationEntity(
            currentMemberId,
            body,
        );

        return this.participationsRepository.save(newParticipation);
    }

    private createParticipationEntity(
        currentMemberId: number,
        body: CreateParticipationDto,
    ) {
        return this.participationsRepository.create({
            memberId: currentMemberId,
            ...body,
        });
    }
}
