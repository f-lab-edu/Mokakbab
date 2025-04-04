import { PickType } from "@nestjs/swagger";

import { ParticipationEntity } from "../entities/participation.entity";

export class CreateParticipationDto extends PickType(ParticipationEntity, [
    "articleId",
]) {}
