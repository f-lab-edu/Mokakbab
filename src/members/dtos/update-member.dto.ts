import { OmitType, PartialType } from "@nestjs/swagger";

import { RegisterMemberDto } from "./register-member.dto";

export class UpdateMemberDto extends PartialType(
    OmitType(RegisterMemberDto, ["email"]),
) {}
