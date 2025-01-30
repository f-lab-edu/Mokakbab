import { PickType } from "@nestjs/swagger";

import { ArticleEntity } from "../entities/article.entity";

export class CreateArticleDto extends PickType(ArticleEntity, [
    "title",
    "content",
    "startTime",
    "endTime",
    "categoryId",
    "districtId",
    "regionId",
    "articleImage",
]) {}
