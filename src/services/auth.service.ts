import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { MemberEntity } from "@APP/entities/member.entity";

import { MembersService } from "./members.service";

@Injectable()
export class AuthService {
    constructor(private readonly membersService: MembersService) {}

    extractTokenFromHeader(header: string, isBearer: boolean) {
        const splitToken = header.split(" ");

        const prefix = isBearer ? "Bearer" : "Basic";

        if (splitToken.length !== 2 || splitToken[0] !== prefix) {
            throw new UnauthorizedException("잘못된 토큰입니다!");
        }

        const token = splitToken[1]!;

        return token;
    }

    decodeBasicToken(base64String: string) {
        const decoded = Buffer.from(base64String, "base64").toString("utf8");
        const splitEmail = decoded.split(":");

        if (splitEmail.length !== 2) {
            throw new UnauthorizedException("잘못된 유형의 토큰입니다!");
        }

        return {
            email: splitEmail[0]!,
            password: splitEmail[1]!,
        };
    }

    async authenticateWithEmailAndPassword(
        member: Pick<MemberEntity, "email" | "password">,
    ) {
        const existMember = await this.membersService.findByEmail(member.email);

        if (!existMember) {
            throw new UnauthorizedException("존재 하지 않는 사용자입니다.");
        }

        const compareOk = await bcrypt.compare(
            member.password,
            existMember.password,
        );

        if (!compareOk) {
            throw new UnauthorizedException("비밀번호가 틀렸습니다.");
        }

        return existMember;
    }
}
