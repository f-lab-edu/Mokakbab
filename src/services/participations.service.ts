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
    /**
     *  해당 메서드를 매번 호출때마다 호출하는것이 비효율적이라 생각하여 멤버 변수를 통해서 호출을 최소화 하였습니다.
     */
    private readonly baseUrl: string;

    constructor(
        private readonly participationsRepository: ParticipationsRepository,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>(ENV_API_BASE_URL) ?? "";
    }

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
                      `${this.baseUrl}/participations/article/${articleId}?cursor=${lastItem.id}&limit=${limit}`,
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
                      `${this.baseUrl}/participations?cursor=${lastItem.id}&limit=${limit}`,
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
