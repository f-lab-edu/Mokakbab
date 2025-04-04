import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ENV_API_BASE_URL } from "@APP/common/constants/env-keys.const";
import { ParticipationStatus } from "@APP/common/enum/participation-status.enum";
import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { ParticipationErrorCode } from "@APP/common/exception/error-code";

import { CreateParticipationDto } from "./dtos/create-participation.dto";
import { ParticipationsRepository } from "./repositories/participations.repository";

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
        const participations =
            await this.participationsRepository.findAllParticipationsByMemberId(
                currentMemberId,
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
        return this.participationsRepository.findOneParticipationByParticipationId(
            participationId,
            currentMemberId,
        );
    }

    async createParticipation(
        currentMemberId: number,
        body: CreateParticipationDto,
    ) {
        const participation =
            await this.participationsRepository.findOneParticipationByParticipationId(
                body.articleId,
                currentMemberId,
            );

        if (!participation) {
            const newParticipation =
                await this.participationsRepository.createParticipation(
                    body.articleId,
                    currentMemberId,
                );

            return newParticipation.raw.insertId;
        }

        if (participation.status === ParticipationStatus.ACTIVE) {
            throw new BusinessErrorException(
                ParticipationErrorCode.ALREADY_PARTICIPATED,
            );
        }

        // 기존 참여 정보가 있고 CANCELLED 상태인 경우, update를 사용
        return this.participationsRepository.updateParticipation(
            participation.id,
            currentMemberId,
            ParticipationStatus.ACTIVE,
        );
    }

    async deleteParticipation(
        participationId: number,
        currentMemberId: number,
    ) {
        const participation =
            await this.participationsRepository.findOneParticipationByParticipationId(
                participationId,
                currentMemberId,
            );

        if (!participation) {
            throw new BusinessErrorException(
                ParticipationErrorCode.NOT_FOUND_PARTICIPATION,
            );
        }

        return this.participationsRepository.updateParticipation(
            participationId,
            currentMemberId,
            ParticipationStatus.CANCELLED,
        );
    }
}
