import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { CreateArticleDto } from "@APP/dtos/create-article.dto";
import { UpdateArticleDto } from "@APP/dtos/update-article.dto";
import { ArticlesService } from "@APP/services/articles.service";

@Controller("articles")
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Get()
    async getArticles(
        @Query("cursor", new ParseIntPipe()) cursor: number,
        @Query("limit", new ParseIntPipe()) limit: number,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        return await this.articlesService.findAll(
            cursor,
            limit,
            currentMemberId,
        );
    }

    @Get(":articleId")
    async getArticle(
        @Param("articleId", new ParseIntPipe()) articleId: number,
    ) {
        return this.articlesService.findById(articleId);
    }

    @Post()
    async postArticle(
        @Body() body: CreateArticleDto,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        return this.articlesService.createArticle(currentMemberId, body);
    }

    @Patch("upload-image")
    @UseInterceptors(FileInterceptor("image"))
    async patchUploadImage(@UploadedFile() file: Express.Multer.File) {
        return {
            filename: file.filename,
        };
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

    @Put(":articleId/like")
    async putArticleLike(
        @Param("articleId", new ParseIntPipe()) articleId: number,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        await this.articlesService.findById(articleId);

        return this.articlesService.likeOrUnLike(currentMemberId, articleId);
    }
}
