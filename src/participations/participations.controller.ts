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

import { ArticlesService } from "@APP/articles/articles.service";
import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { TokenOnlyGuard } from "@APP/common/guards/token-only.guard";

import { CreateParticipationDto } from "./dtos/create-participation.dto";
import { ParticipationsService } from "./participations.service";

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
        const [participation, article] = await Promise.all([
            this.participationsService.getParticipationsByArticleId(
                articleId,
                cursor,
                limit,
            ),
            this.articlesService.findById(articleId),
        ]);

        return {
            ...participation,
            article,
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
