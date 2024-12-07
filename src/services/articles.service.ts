import { Injectable } from "@nestjs/common";

import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { ArticleErrorCode } from "@APP/common/exception/error-code";
import { CreateArticleDto } from "@APP/dtos/create-article.dto";
import { UpdateArticleDto } from "@APP/dtos/update-article.dto";
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
    ) {}

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
}
