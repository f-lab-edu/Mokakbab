import {
    Body,
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from "@nestjs/common";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { CreateArticleDto } from "@APP/dtos/create-article.dto";
import { UpdateArticleDto } from "@APP/dtos/update-article.dto";
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

    @Patch(":articleId")
    async patchArticle(
        @Param("articleId", new ParseIntPipe()) articleId: number,
        @Body() body: UpdateArticleDto,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        return this.articlesService.updateById(
            articleId,
            currentMemberId,
            body,
        );
    }

    @Delete(":articleId")
    async deleteArticle(
        @Param("articleId", new ParseIntPipe()) articleId: number,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        return this.articlesService.deleteById(articleId, currentMemberId);
    }
}
