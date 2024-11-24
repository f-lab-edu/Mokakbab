import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
} from "@nestjs/common";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { CreateParticipationDto } from "@APP/dtos/create-participation.dto";
import { ArticlesService } from "@APP/services/articles.service";
import { ParticipationsService } from "@APP/services/participations.service";

@Controller("participations")
export class ParticipationsController {
    constructor(
        private readonly participationsService: ParticipationsService,
        private readonly articlesService: ArticlesService,
    ) {}

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
