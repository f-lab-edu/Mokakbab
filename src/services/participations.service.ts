import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { ParticipationStatus } from "@APP/common/enum/participation-status.enum";
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

        if (participation.status === ParticipationStatus.CANCELLED) {
            const updatedParticipation = this.createParticipationEntity(
                currentMemberId,
                body,
                ParticipationStatus.ACTIVE,
            );

            return this.participationsRepository.save(updatedParticipation);
        }

        throw new ConflictException("이미 참여한 게시글입니다.");
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
            throw new NotFoundException("참여 정보를 찾을 수 없습니다.");
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
