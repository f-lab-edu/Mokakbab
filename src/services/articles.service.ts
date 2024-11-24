import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

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
    ) {}

    async findById(articleId: number) {
        const article = await this.articlesRepository.findOne({
            where: { id: articleId },
        });

        if (!article) {
            throw new NotFoundException("게시글을 찾을 수 없습니다.");
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
            throw new NotFoundException("카테고리를 찾을 수 없습니다.");
        }

        if (!district || !region) {
            throw new NotFoundException("지역을 찾을 수 없습니다.");
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
            throw new NotFoundException("게시글을 찾을 수 없습니다.");
        }

        if (article.memberId !== currentMemberId) {
            throw new ForbiddenException("권한이 없습니다.");
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
            throw new NotFoundException("게시글을 찾을 수 없습니다.");
        }

        if (article.memberId !== currentMemberId) {
            throw new ForbiddenException("권한이 없습니다.");
        }

        await this.articlesRepository.delete(articleId);
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
