import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ENV_API_BASE_URL } from "@APP/common/constants/env-keys.const";
import { ParticipationStatus } from "@APP/common/enum/participation-status.enum";
import { CreateParticipationDto } from "@APP/dtos/create-participation.dto";
import { ParticipationRepository } from "@APP/repositories/participation.repository";

@Injectable()
export class ParticipationsService {
    constructor(
        private readonly participationsRepository: ParticipationRepository,
        private readonly configService: ConfigService,
    ) {}

    async getParticipationsByArticleId(
        articleId: number,
        cursor: number,
        limit: number,
    ) {
        const query = this.participationsRepository
            .createQueryBuilder("participation")
            .where("participation.articleId = :articleId", {
                articleId,
            })
            .orderBy("participation.id", "ASC")
            .take(limit + 1);

        if (cursor) {
            query.andWhere("participation.id > :cursor", { cursor });
        }

        const participations = await query.getMany();
        const hasNextPage = participations.length > limit;
        const results = hasNextPage
            ? participations.slice(0, -1)
            : participations;

        const lastItem = results[results.length - 1];
        const nextUrl =
            lastItem && hasNextPage
                ? new URL(
                      `${this.configService.get(ENV_API_BASE_URL)}/participations/article/${articleId}?cursor=${lastItem.id}&limit=${limit}`,
                  )
                : null;

        return {
            data: results,
            cursor: {
                after: lastItem?.id,
            },
            count: results.length,
            next: nextUrl?.toString(),
        };
    }

    async getParticipations(
        currentMemberId: number,
        cursor: number,
        limit: number,
    ) {
        const query = this.participationsRepository
            .createQueryBuilder("participation")
            .where("participation.memberId = :memberId", {
                memberId: currentMemberId,
            })
            .orderBy("participation.id", "ASC")
            .take(limit + 1);

        if (cursor) {
            query.andWhere("participation.id > :cursor", { cursor });
        }

        const participations = await query.getMany();
        const hasNextPage = participations.length > limit;
        const results = hasNextPage
            ? participations.slice(0, -1)
            : participations;

        const lastItem = results[results.length - 1];
        const nextUrl =
            lastItem && hasNextPage
                ? new URL(
                      `${this.configService.get(ENV_API_BASE_URL)}/participations?cursor=${lastItem.id}&limit=${limit}`,
                  )
                : null;

        return {
            data: results,
            cursor: {
                after: lastItem?.id,
            },
            count: results.length,
            next: nextUrl?.toString(),
        };
    }

    async getParticipation(participationId: number, currentMemberId: number) {
        return await this.participationsRepository.findOne({
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

            return await this.participationsRepository.save(newParticipation);
        }

        if (participation.status === ParticipationStatus.CANCELLED) {
            const updatedParticipation = this.createParticipationEntity(
                currentMemberId,
                body,
                ParticipationStatus.ACTIVE,
            );

            return await this.participationsRepository.save(
                updatedParticipation,
            );
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

        await this.participationsRepository.update(
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
