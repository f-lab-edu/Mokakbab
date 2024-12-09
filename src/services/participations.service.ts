import { Injectable } from "@nestjs/common";

import { ParticipationStatus } from "@APP/common/enum/participation-status.enum";
import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { ParticipationErrorCode } from "@APP/common/exception/error-code";
import { CreateParticipationDto } from "@APP/dtos/create-participation.dto";
import { ParticipationsRepository } from "@APP/repositories/participations.repository";

@Injectable()
export class ParticipationsService {
    constructor(
        private readonly participationsRepository: ParticipationsRepository,
    ) {}

    getParticipation(participationId: number, currentMemberId: number) {
        return this.participationsRepository.findOne({
            where: { id: participationId, memberId: currentMemberId },
        });
    }

    async createParticipation(
        currentMemberId: number,
        body: CreateParticipationDto,
    ) {
        const participation = await this.participationsRepository.findOne({
            where: {
                memberId: currentMemberId,
                articleId: body.articleId,
            },
        });

        if (!participation) {
            const newParticipation = this.createParticipationEntity(
                currentMemberId,
                body,
            );

            return this.participationsRepository.save(newParticipation);
        }

        if (participation.status === ParticipationStatus.ACTIVE) {
            throw new BusinessErrorException(
                ParticipationErrorCode.ALREADY_PARTICIPATED,
            );
        }

        const updatedParticipation = this.createParticipationEntity(
            currentMemberId,
            body,
            ParticipationStatus.ACTIVE,
        );

        return this.participationsRepository.save(updatedParticipation);
    }

    private createParticipationEntity(
        currentMemberId: number,
        body: CreateParticipationDto,
        status?: ParticipationStatus,
    ) {
        return this.participationsRepository.create({
            memberId: currentMemberId,
            ...body,
            status,
        });
    }

    async deleteParticipation(
        participationId: number,
        currentMemberId: number,
    ) {
        const participation = await this.participationsRepository.findOne({
            where: { id: participationId, memberId: currentMemberId },
        });

        if (!participation) {
            throw new BusinessErrorException(
                ParticipationErrorCode.NOT_FOUND_PARTICIPATION,
            );
        }

        return this.participationsRepository.update(
            {
                id: participationId,
                memberId: currentMemberId,
            },
            {
                status: ParticipationStatus.CANCELLED,
            },
        );
    }
}
