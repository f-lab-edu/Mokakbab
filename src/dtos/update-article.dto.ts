import { PartialType } from "@nestjs/mapped-types";

import { CreateArticleDto } from "@APP/dtos/create-article.dto";

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
