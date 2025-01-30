import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MulterBuilder } from "@APP/common/builders/multer.builder";

import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { ArticleLikeEntity } from "./entities/article-like.entity";
import { ArticleEntity } from "./entities/article.entity";
import { CategoryEntity } from "./entities/category.entity";
import { DistrictEntity } from "./entities/district.entity";
import { RegionEntity } from "./entities/region.entity";
import { ArticleLikesRepository } from "./repositories/article-likes.repository";
import { ArticlesRepository } from "./repositories/articles.repository";
import { CategoriesRepository } from "./repositories/categories.repository";
import { DistrictsRepository } from "./repositories/districts.repository";
import { RegionsRepository } from "./repositories/regions.repository";

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
                    .setPath("/thumbnail")
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
