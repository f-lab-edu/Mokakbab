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
        /**
         * 쿼리를 병렬 처리하는것은 쿼리 개수 n만큼의 커넥션풀을 사용하여 높은 RPS에서 오히려 더 성능저하 되었습니다.
         * 쿼리를 순차적으로 처리하는것이 더 성능이 좋았습니다.
         */
        const participation =
            await this.participationsService.getParticipationsByArticleId(
                articleId,
                cursor,
                limit,
            );

        const article = await this.articlesService.findById(articleId);

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
