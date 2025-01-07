import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ENV_API_BASE_URL } from "@APP/common/constants/env-keys.const";
import { ParticipationStatus } from "@APP/common/enum/participation-status.enum";
import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { ParticipationErrorCode } from "@APP/common/exception/error-code";
import { CreateParticipationDto } from "@APP/dtos/create-participation.dto";
import { ParticipationsRepository } from "@APP/repositories/participations.repository";

@Injectable()
export class ParticipationsService {
    constructor(
        private readonly participationsRepository: ParticipationsRepository,
        private readonly configService: ConfigService,
    ) {}

    async getParticipationsByArticleId(
        articleId: number,
        cursor: number,
        limit: number,
    ) {
        const participations =
            await this.participationsRepository.findAllParticipationsByArticleId(
                articleId,
                cursor,
                limit,
            );

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

        // 기존 참여 정보가 있고 CANCELLED 상태인 경우, update를 사용
        return this.participationsRepository.save({
            ...participation,
            status: ParticipationStatus.ACTIVE,
        });
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
