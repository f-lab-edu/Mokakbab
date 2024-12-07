import { BadRequestException, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import multer from "multer";
import { extname } from "path";

import { MAX_FILE_SIZE } from "@APP/common/constants/number.const";
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
        MulterModule.register({
            limits: {
                fileSize: MAX_FILE_SIZE,
            },
            fileFilter: (_req, file, cb) => {
                const ext = extname(file.originalname);
                if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
                    return cb(
                        new BadRequestException(
                            "jpg/jpeg/png 파일만 업로드 가능합니다",
                        ),
                        false,
                    );
                }

                return cb(null, true);
            },

            storage: multer.diskStorage({
                destination: function (_req, _file, cb) {
                    cb(null, "uploads/articles/");
                },
                filename: function (_req, file, cb) {
                    cb(null, `${Date.now()}-${file.originalname}`);
                },
            }),
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
