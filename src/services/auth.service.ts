import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { ENV_JWT_SECRET_KEY } from "@APP/common/constants/env-keys.const";
import { RegisterMemberDto } from "@APP/dtos/register-member.dto";
import { MemberEntity } from "@APP/entities/member.entity";

import { MembersService } from "./members.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly membersService: MembersService,
        private readonly configService: ConfigService,
    ) {}

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

    async signInByEmail(member: Pick<MemberEntity, "email" | "password">) {
        const existMember = await this.authenticateWithEmailAndPassword(member);

        return this.signInMember(existMember);
    }

    async registerByEmail(dto: RegisterMemberDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newMember = await this.membersService.createMember({
            ...dto,
            password: hashedPassword,
        });

        return this.signInMember(newMember);
    }

    private signInMember(member: Pick<MemberEntity, "email" | "id">) {
        return {
            accessToken: this.signToken(member, false),
            refreshToken: this.signToken(member, true),
        };
    }

    private signToken(
        member: Pick<MemberEntity, "email" | "id">,
        isRefreshToken: boolean,
    ) {
        const payload = {
            email: member.email,
            sub: member.id,
            type: isRefreshToken ? "refresh" : "access",
        };

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
            expiresIn: isRefreshToken ? 3600 : 300,
        });
    }
}
