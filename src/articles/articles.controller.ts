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
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { AccessTokenGuard } from "@APP/common/guards/access-token.guard";

import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dtos/create-article.dto";
import { UpdateArticleDto } from "./dtos/update-article.dto";

@Controller("articles")
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Get()
    getArticles(
        @Query("cursor", new ParseIntPipe()) cursor: number,
        @Query("limit", new ParseIntPipe()) limit: number,
    ) {
        return this.articlesService.findAll2(cursor, limit);
    }

    @Get(":articleId")
    getArticle(@Param("articleId", new ParseIntPipe()) articleId: number) {
        return this.articlesService.findById(articleId);
    }

    @UseGuards(AccessTokenGuard)
    @Post()
    async postArticle(
        @Body(new ValidationPipe({ transform: true })) body: CreateArticleDto,
        @CurrentMemberDecorator("id") currentMemberId: number,
    ) {
        return (await this.articlesService.createArticle(currentMemberId, body))
            .raw.insertId;
    }

    @Patch("upload-image")
    @UseInterceptors(FileInterceptor("image"))
    patchUploadImage(
        @UploadedFile()
        file: Express.Multer.File & { key: string; location: string },
    ) {
        return {
            filename: file.key.split("/").at(-1) || "",
            location: file.location,
        };
    }

    @Patch(":articleId")
    patchArticle(
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
    deleteArticle(
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
