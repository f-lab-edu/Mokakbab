import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MulterBuilder } from "@APP/common/builders/multer.builder";
import { ArticlesController } from "@APP/controllers/articles.controller";
import { ArticleLikeEntity } from "@APP/entities/article-like.entity";
import { ArticleEntity } from "@APP/entities/article.entity";
import { CategoryEntity } from "@APP/entities/category.entity";
import { DistrictEntity } from "@APP/entities/district.entity";
import { RegionEntity } from "@APP/entities/region.entity";
import { ArticleLikesRepository } from "@APP/repositories/article-likes.repository";
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
            ArticleLikeEntity,
        ]),
        MulterModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new MulterBuilder(configService)
                    .setResource("articles")
                    .setPath("/somenail")
                    .build();
            },
        }),
    ],
    controllers: [ArticlesController],
    providers: [
        ArticlesService,
        ArticlesRepository,
        CategoriesRepository,
        DistrictsRepository,
        RegionsRepository,
        ArticleLikesRepository,
    ],
    exports: [ArticlesService],
})
export class ArticlesModule {}
