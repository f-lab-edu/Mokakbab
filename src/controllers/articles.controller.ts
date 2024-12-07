import { Body, Controller, Post } from "@nestjs/common";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { CreateArticleDto } from "@APP/dtos/create-article.dto";
import { ArticlesService } from "@APP/services/articles.service";

@Controller("articles")
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Post()
    postArticle(
        @Body() body: CreateArticleDto,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        return this.articlesService.createArticle(currentMemberId, body);
    }
}
