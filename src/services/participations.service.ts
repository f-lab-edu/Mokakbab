import { Injectable } from "@nestjs/common";

import { CreateParticipationDto } from "@APP/dtos/create-participation.dto";
import { ParticipationRepository } from "@APP/repositories/participation.repository";

@Injectable()
export class ParticipationsService {
    constructor(
        private readonly participationsRepository: ParticipationRepository,
    ) {}

    async createParticipation(
        currentMemberId: number,
        body: CreateParticipationDto,
    ) {
        const newParticipation = this.createParticipationEntity(
            currentMemberId,
            body,
        );

        return await this.participationsRepository.save(newParticipation);
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
