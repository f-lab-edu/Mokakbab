import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ENV_API_BASE_URL } from "@APP/common/constants/env-keys.const";
import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { ArticleErrorCode } from "@APP/common/exception/error-code";
import { CreateArticleDto } from "@APP/dtos/create-article.dto";
import { UpdateArticleDto } from "@APP/dtos/update-article.dto";
import { ArticleLikesRepository } from "@APP/repositories/article-likes.repository";
import { ArticlesRepository } from "@APP/repositories/articles.repository";
import { CategoriesRepository } from "@APP/repositories/categories.repository";
import { DistrictsRepository } from "@APP/repositories/districts.repository";
import { RegionsRepository } from "@APP/repositories/regions.repository";

@Injectable()
export class ArticlesService {
    constructor(
        private readonly articlesRepository: ArticlesRepository,
        private readonly categoriesRepository: CategoriesRepository,
        private readonly districtsRepository: DistrictsRepository,
        private readonly regionsRepository: RegionsRepository,
        private readonly articleLikesRepository: ArticleLikesRepository,
        private readonly configService: ConfigService,
    ) {}

    async findAll(cursor: number, limit: number = 10, currentMemberId: number) {
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
            return new URL(
                `/public/${type}/${filename}`,
                this.configService.get(ENV_API_BASE_URL),
            ).toString();
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
            return new URL(
                `/public/${type}/${filename}`,
                this.configService.get(ENV_API_BASE_URL),
            ).toString();
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
        const article = await this.articlesRepository.findOne({
            where: { id: articleId },
        });

        if (!article) {
            throw new BusinessErrorException(
                ArticleErrorCode.NOT_FOUND_ARTICLE,
            );
        }

        return article;
    }

    async createArticle(currentMemberId: number, body: CreateArticleDto) {
        const [category, district, region] = await Promise.all([
            this.categoriesRepository.exists({
                where: {
                    id: body.categoryId,
                },
            }),
            this.districtsRepository.exists({
                where: {
                    id: body.districtId,
                },
            }),
            this.regionsRepository.exists({
                where: {
                    id: body.regionId,
                },
            }),
        ]);

        if (!category) {
            throw new BusinessErrorException(
                ArticleErrorCode.NOT_FOUND_CATEGORY,
            );
        }

        if (!district || !region) {
            throw new BusinessErrorException(ArticleErrorCode.NOT_FOUND_REGION);
        }

        return this.articlesRepository.save(
            this.createArticleEntity(currentMemberId, body),
        );
    }

    async updateById(
        articleId: number,
        currentMemberId: number,
        body: UpdateArticleDto,
    ) {
        const article = await this.articlesRepository.findOne({
            where: { id: articleId },
        });

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

        await this.articlesRepository.update(
            {
                id: articleId,
            },
            body,
        );

        return this.articlesRepository.findOne({
            where: { id: articleId },
        });
    }

    async deleteById(articleId: number, currentMemberId: number) {
        const article = await this.articlesRepository.findOne({
            where: { id: articleId },
        });

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

        return this.articlesRepository.delete(articleId);
    }

    private createArticleEntity(
        currentMemberId: number,
        body: CreateArticleDto,
    ) {
        return this.articlesRepository.create({
            memberId: currentMemberId,
            ...body,
        });
    }

    async likeOrUnLike(memberId: number, articleId: number): Promise<boolean> {
        const like = await this.articleLikesRepository.findOneBy({
            memberId,
            articleId,
        });

        if (like) {
            await this.articleLikesRepository.remove(like);
        } else {
            await this.articleLikesRepository.save({ memberId, articleId });
        }

        return !like;
    }
}
