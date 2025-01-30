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
    UseGuards,
} from "@nestjs/common";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { TokenOnlyGuard } from "@APP/common/guards/token-only.guard";
import { CreateParticipationDto } from "@APP/dtos/create-participation.dto";
import { ArticlesService } from "@APP/services/articles.service";
import { ParticipationsService } from "@APP/services/participations.service";

@Controller("participations")
export class ParticipationsController {
    constructor(
        private readonly participationsService: ParticipationsService,
        private readonly articlesService: ArticlesService,
    ) {}

    @UseGuards(TokenOnlyGuard)
    @Get("articles/:articleId")
    async getParticipationsByArticle(
        @Param("articleId", new ParseIntPipe()) articleId: number,
        @Query("cursor", new ParseIntPipe()) cursor: number,
        @Query("limit", new ParseIntPipe()) limit: number,
    ) {
        // 28.514ms
        console.time("getParticipationsByArticle");
        const participation =
            await this.participationsService.getParticipationsByArticleId(
                articleId,
                cursor,
                limit,
            );

        const article = await this.articlesService.findById(articleId);

        const article2 = await this.articlesService.findById(articleId);
        console.timeEnd("getParticipationsByArticle");
        return {
            ...participation,
            article,
            article2,
        };
    }

    @UseGuards(TokenOnlyGuard)
    @Get("articles2/:articleId")
    async getParticipationsByArticle2(
        @Param("articleId", new ParseIntPipe()) articleId: number,
        @Query("cursor", new ParseIntPipe()) cursor: number,
        @Query("limit", new ParseIntPipe()) limit: number,
    ) {
        // 8.43ms
        console.time("getParticipationsByArticle2");
        const [article, article2, participations] = await Promise.all([
            this.articlesService.findById(articleId),
            this.articlesService.findById(articleId),
            this.participationsService.getParticipationsByArticleId(
                articleId,
                cursor,
                limit,
            ),
        ]);
        console.timeEnd("getParticipationsByArticle2");
        return {
            ...participations,
            article,
            article2,
        };
    }

    @Get()
    getParticipations(
        @CurrentMemberDecorator("id") currentMemberId: number,
        @Query("cursor", new ParseIntPipe()) cursor: number,
        @Query("limit", new ParseIntPipe()) limit: number,
    ) {
        return this.participationsService.getParticipations(
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
