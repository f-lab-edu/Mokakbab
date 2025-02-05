import { PartialType, PickType } from "@nestjs/swagger";

import { MemberEntity } from "../entities/member.entity";

export class UpdateMemberDto extends PartialType(
    PickType(MemberEntity, ["id", "email", "name", "nickname", "password"]),
) {}
