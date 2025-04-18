import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
    ENV_API_BASE_URL,
    ENV_AWS_S3_BUCKET_URL,
} from "@APP/common/constants/env-keys.const";
import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { ArticleErrorCode } from "@APP/common/exception/error-code";

import { CreateArticleDto } from "./dtos/create-article.dto";
import { UpdateArticleDto } from "./dtos/update-article.dto";
import { ArticleLikesRepository } from "./repositories/article-likes.repository";
import { ArticlesRepository } from "./repositories/articles.repository";
import { CategoriesRepository } from "./repositories/categories.repository";
import { DistrictsRepository } from "./repositories/districts.repository";
import { RegionsRepository } from "./repositories/regions.repository";

@Injectable()
export class ArticlesService {
    private readonly bucketUrl: string;
    private readonly env: string;
    constructor(
        private readonly articlesRepository: ArticlesRepository,
        private readonly categoriesRepository: CategoriesRepository,
        private readonly districtsRepository: DistrictsRepository,
        private readonly regionsRepository: RegionsRepository,
        private readonly articleLikesRepository: ArticleLikesRepository,
        private readonly configService: ConfigService,
    ) {
        this.bucketUrl =
            this.configService.get(ENV_AWS_S3_BUCKET_URL) || "BUKET_URL";
        this.env = this.configService.get<string>("NODE_ENV") || "default";
    }

    async findAll(currentMemberId: number, cursor: number, limit: number = 10) {
        const articles = await this.articlesRepository.findAllV1(
            currentMemberId,
            cursor,
            limit,
        );

        const transformImageUrl = (
            filename: string | null,
            type: "articles" | "members",
        ) => {
            if (!filename) return null;
            const kind = type === "articles" ? "thumbnail" : "profile";
            return `${this.bucketUrl}/${type}/${this.env}/${kind}/${filename}`;
        };

        const transformedArticles = articles.map((article) => ({
            ...article,
            articleImage: transformImageUrl(article.articleImage, "articles"),
            memberProfileImage: transformImageUrl(
                article.memberProfileImage,
                "members",
            ),
        }));

        const hasNextPage = transformedArticles.length > limit;
        const results = hasNextPage
            ? transformedArticles.slice(0, -1)
            : transformedArticles;

        const lastItem = results[results.length - 1];

        const nextUrl =
            lastItem && hasNextPage
                ? new URL(
                      `${this.configService.get(ENV_API_BASE_URL)}/articles?cursor=${lastItem.id}&limit=${limit}`,
                  )
                : null;

        return {
            data: results,
            cursor: {
                after: lastItem?.id,
            },
            count: results.length,
            next: nextUrl?.toString(),
        };
    }

    async findAll2(cursor: number, limit: number = 10) {
        const articles = await this.articlesRepository.findAllV2(cursor, limit);

        const transformImageUrl = (
            filename: string | null,
            type: "articles" | "members",
        ) => {
            if (!filename) return null;
            const kind = type === "articles" ? "thumbnail" : "profile";
            return `${this.bucketUrl}/${type}/${this.env}/${kind}/${filename}`;
        };

        const transformedArticles = articles.map((article) => ({
            ...article,
            articleImage: transformImageUrl(article.articleImage, "articles"),
            memberProfileImage: transformImageUrl(
                article.memberProfileImage,
                "members",
            ),
        }));

        const hasNextPage = transformedArticles.length > limit;
        const results = hasNextPage
            ? transformedArticles.slice(0, -1)
            : transformedArticles;

        const lastItem = results[results.length - 1];

        const nextUrl =
            lastItem && hasNextPage
                ? new URL(
                      `${this.configService.get(ENV_API_BASE_URL)}/articles?cursor=${lastItem.id}&limit=${limit}`,
                  )
                : null;

        return {
            data: results,
            cursor: {
                after: lastItem?.id,
            },
            count: results.length,
            next: nextUrl?.toString(),
        };
    }

    async findById(articleId: number) {
        const article = await this.articlesRepository.findById(articleId);

        if (!article) {
            throw new BusinessErrorException(
                ArticleErrorCode.NOT_FOUND_ARTICLE,
            );
        }

        return article;
    }

    async createArticle(currentMemberId: number, body: CreateArticleDto) {
        const [category, district, region] = await Promise.all([
            this.categoriesRepository.existsById(body.categoryId),
            this.districtsRepository.existsById(body.districtId),
            this.regionsRepository.existsById(body.regionId),
        ]);

        if (!category) {
            throw new BusinessErrorException(
                ArticleErrorCode.NOT_FOUND_CATEGORY,
            );
        }

        if (!district || !region) {
            throw new BusinessErrorException(ArticleErrorCode.NOT_FOUND_REGION);
        }

        return this.articlesRepository.createArticle(body, currentMemberId);
    }

    async updateById(
        articleId: number,
        currentMemberId: number,
        body: UpdateArticleDto,
    ) {
        const article =
            await this.articlesRepository.findOneByArticleId(articleId);

        if (!article) {
            throw new BusinessErrorException(
                ArticleErrorCode.NOT_FOUND_ARTICLE,
            );
        }

        if (article.memberId !== currentMemberId) {
            throw new BusinessErrorException(
                ArticleErrorCode.FORBIDDEN_ARTICLE,
            );
        }

        await this.articlesRepository.updateByArticleId(articleId, body);

        return this.articlesRepository.findOneByArticleId(articleId);
    }

    async deleteById(articleId: number, currentMemberId: number) {
        const article =
            await this.articlesRepository.findOneByArticleId(articleId);

        if (!article) {
            throw new BusinessErrorException(
                ArticleErrorCode.NOT_FOUND_ARTICLE,
            );
        }

        if (article.memberId !== currentMemberId) {
            throw new BusinessErrorException(
                ArticleErrorCode.FORBIDDEN_ARTICLE,
            );
        }

        return this.articlesRepository.deleteByArticleId(articleId);
    }

    async likeOrUnLike(memberId: number, articleId: number): Promise<boolean> {
        const like =
            await this.articleLikesRepository.existsByArticleIdAndMemberId(
                articleId,
                memberId,
            );

        if (like) {
            await this.articleLikesRepository.deleteArticleLike(
                articleId,
                memberId,
            );
        } else {
            await this.articleLikesRepository.createArticleLike(
                articleId,
                memberId,
            );
        }

        return !like;
    }
}
