import { PickType } from "@nestjs/swagger";

import { MemberEntity } from "../entities/member.entity";

export class RegisterMemberDto extends PickType(MemberEntity, [
    "email",
    "name",
    "nickname",
    "password",
]) {}
