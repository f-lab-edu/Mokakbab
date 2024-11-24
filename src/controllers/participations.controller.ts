import { Body, Controller, Post } from "@nestjs/common";

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

    @Post()
    async postParticipation(
        @Body() body: CreateParticipationDto,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        await this.articlesService.findById(body.articleId);

        return await this.participationsService.createParticipation(
            currentMemberId,
            body,
        );
    }
}
