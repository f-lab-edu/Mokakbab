import { PickType } from "@nestjs/swagger";

import { BlockListEntity } from "@APP/entities/block-list.entity";

export class CreateBlockListDto extends PickType(BlockListEntity, [
    "blockedId",
]) {}
