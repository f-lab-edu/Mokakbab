import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticlesController } from "@APP/controllers/articles.controller";
import { ArticleLikeEntity } from "@APP/entities/article-like.entity";
import { ArticleEntity } from "@APP/entities/article.entity";
import { CategoryEntity } from "@APP/entities/category.entity";
import { DistrictEntity } from "@APP/entities/district.entity";
import { RegionEntity } from "@APP/entities/region.entity";
import { ArticlesRepository } from "@APP/repositories/articles.repository";
import { CategoriesRepository } from "@APP/repositories/categories.repository";
import { DistrictsRepository } from "@APP/repositories/districts.repository";
import { RegionsRepository } from "@APP/repositories/regions.repository";
import { ArticlesService } from "@APP/services/articles.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArticleEntity,
            ArticleLikeEntity,
            CategoryEntity,
            DistrictEntity,
            RegionEntity,
        ]),
    ],
    controllers: [ArticlesController],
    providers: [
        ArticlesService,
        ArticlesRepository,
        CategoriesRepository,
        DistrictsRepository,
        RegionsRepository,
    ],
    exports: [],
})
export class ArticlesModule {}
