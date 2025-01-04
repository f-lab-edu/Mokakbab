import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from "@nestjs/common";
import { DataSource } from "typeorm";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { IsPublicDecorator } from "@APP/common/decorators/is-public.decorator";
import { IsPublicEnum } from "@APP/common/enum/is-public.enum";
import { CreateParticipationDto } from "@APP/dtos/create-participation.dto";
import { ArticlesService } from "@APP/services/articles.service";
import { ParticipationsService } from "@APP/services/participations.service";

@Controller("participations")
export class ParticipationsController {
    constructor(
        private readonly participationsService: ParticipationsService,
        private readonly articlesService: ArticlesService,
        private readonly dataSource: DataSource,
    ) {}

    @Get("articles/:articleId")
    async getParticipationsByArticle(
        @Param("articleId", new ParseIntPipe()) articleId: number,
        @Query("cursor", new ParseIntPipe()) cursor: number,
        @Query("limit", new ParseIntPipe()) limit: number,
    ) {
        const [article, participation] = await Promise.all([
            this.articlesService.findById(articleId),
            this.participationsService.getParticipationsByArticleId(
                articleId,
                cursor,
                limit,
            ),
        ]);

        const driver: any = this.dataSource.driver; // TypeORM의 드라이버 접근
        const pool = driver.pool; // MySQL2의 연결 풀 가져오기

        console.log("MySQL2 Connection Pool:", {
            total: pool._allConnections.length, // 총 커넥션 수
            idle: pool._freeConnections.length, // 대기 중인 커넥션 수
            waitingClients: pool._connectionQueue.length, // 대기 중인 요청
        });

        return {
            ...participation,
            article,
        };
    }
    /**
     *
     * Guard가 없는 경우도 테스트 한 후에 비교하기 위한 api
     */
    @IsPublicDecorator(IsPublicEnum.PUBLIC)
    @Get("articles2/:articleId")
    async getParticipationsByArticle2(
        @Param("articleId", new ParseIntPipe()) articleId: number,
        @Query("cursor", new ParseIntPipe()) cursor: number,
        @Query("limit", new ParseIntPipe()) limit: number,
    ) {
        const [article, participation] = await Promise.all([
            this.articlesService.findById(articleId),
            this.participationsService.getParticipationsByArticleId(
                articleId,
                cursor,
                limit,
            ),
        ]);

        return {
            ...participation,
            article,
        };
    }

    @Get()
    async getParticipations(
        @CurrentMemberDecorator("id") currentMemberId: number,
        @Query("cursor", new ParseIntPipe()) cursor: number,
        @Query("limit", new ParseIntPipe()) limit: number,
    ) {
        return await this.participationsService.getParticipations(
            currentMemberId,
            cursor,
            limit,
        );
    }

    @Get(":participationId")
    async getParticipation(
        @Param("participationId") participationId: number,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        const participation = await this.participationsService.getParticipation(
            participationId,
            currentMemberId,
        );

        if (!participation) {
            throw new NotFoundException("참여 정보를 찾을 수 없습니다.");
        }

        return participation;
    }

    @Post()
    async postParticipation(
        @Body() body: CreateParticipationDto,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        await this.articlesService.findById(body.articleId);

        return this.participationsService.createParticipation(
            currentMemberId,
            body,
        );
    }

    @Delete(":participationId")
    deleteParticipation(
        @Param("participationId") participationId: number,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        return this.participationsService.deleteParticipation(
            participationId,
            currentMemberId,
        );
    }
}
