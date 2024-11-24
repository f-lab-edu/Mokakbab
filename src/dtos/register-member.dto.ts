import { PickType } from "@nestjs/swagger";

import { MemberEntity } from "@APP/entities/member.entity";

export class RegisterMemberDto extends PickType(MemberEntity, [
    "email",
    "name",
    "nickname",
    "password",
]) {}
