import { PickType } from "@nestjs/swagger";

import { MemberEntity } from "@APP/entities/member.entity";

export class VerifyEmailDto extends PickType(MemberEntity, [
    "email",
    "verificationCode",
] as const) {}
