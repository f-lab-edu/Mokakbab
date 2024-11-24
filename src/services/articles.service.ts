import { Injectable, NotFoundException } from "@nestjs/common";

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
            throw new NotFoundException("카테고리를 찾을 수 없습니다.");
        }

        if (!district || !region) {
            throw new NotFoundException("지역을 찾을 수 없습니다.");
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
