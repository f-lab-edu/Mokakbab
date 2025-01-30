import { PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { MemberEntity } from "../entities/member.entity";

export class VerifyEmailDto extends PickType(MemberEntity, ["email"] as const) {
    @IsNotEmpty()
    @IsString()
    verificationCode!: string;
}
