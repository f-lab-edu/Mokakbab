import { PickType } from "@nestjs/swagger";

import { BlackListEntity } from "@APP/entities/black-list.entity";

export class CreateBlackListDto extends PickType(BlackListEntity, [
    "blackedId",
]) {}
