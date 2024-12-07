import { Injectable } from "@nestjs/common";

import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { ArticleErrorCode } from "@APP/common/exception/error-code";
import { CreateArticleDto } from "@APP/dtos/create-article.dto";
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
