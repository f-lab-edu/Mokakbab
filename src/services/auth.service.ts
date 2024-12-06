import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

import { ENV_JWT_SECRET_KEY } from "@APP/common/constants/env-keys.const";
import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { MemberErrorCode } from "@APP/common/exception/error-code";
import { RegisterMemberDto } from "@APP/dtos/register-member.dto";
import { VerifyEmailDto } from "@APP/dtos/verify-email.dto";
import { MemberEntity } from "@APP/entities/member.entity";

import { MailsService } from "./mails.service";
import { MembersService } from "./members.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly membersService: MembersService,
        private readonly mailsService: MailsService,
        private readonly configService: ConfigService,
    ) {}

    extractTokenFromHeader(header: string, isBearer: boolean) {
        const splitToken = header.split(" ");

        const prefix = isBearer ? "Bearer" : "Basic";

        if (splitToken.length !== 2 || splitToken[0] !== prefix) {
            throw new BusinessErrorException(MemberErrorCode.INVALID_TOKEN);
        }

        const token = splitToken[1]!;

        return token;
    }

    decodeBasicToken(base64String: string) {
        const decoded = Buffer.from(base64String, "base64").toString("utf8");
        const splitEmail = decoded.split(":");

        if (splitEmail.length !== 2) {
            throw new BusinessErrorException(MemberErrorCode.INVALID_TOKEN);
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
            throw new BusinessErrorException(MemberErrorCode.NOT_FOUND_MEMBER);
        }

        const compareOk = await bcrypt.compare(
            member.password,
            existMember.password,
        );

        if (!compareOk) {
            throw new BusinessErrorException(MemberErrorCode.INVALID_PASSWORD);
        }

        return existMember;
    }

    async signInByEmail(member: Pick<MemberEntity, "email" | "password">) {
        const existMember = await this.authenticateWithEmailAndPassword(member);

        return this.signInMember(existMember);
    }

    async registerByEmail(dto: RegisterMemberDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const verificationCode = this.generateVerificationCode();

        const existMember = await this.membersService.existByEmail(dto.email);

        if (existMember) {
            throw new BusinessErrorException(
                MemberErrorCode.EMAIL_ALREADY_EXISTS,
            );
        }

        const newMember = await this.membersService.createMember(
            {
                ...dto,
                password: hashedPassword,
            },
            verificationCode,
        );

        await this.mailsService.sendVerificationEmail(
            newMember.email,
            verificationCode,
        );

        return this.signInMember(newMember);
    }

    private async signInMember(member: Pick<MemberEntity, "email" | "id">) {
        const tokens = {
            accessToken: this.signToken(member, false),
            refreshToken: this.signToken(member, true),
        };

        const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

        void this.membersService.saveRefreshToken(
            member.id,
            hashedRefreshToken,
        );

        return tokens;
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
            secret:
                this.configService.get<string>(ENV_JWT_SECRET_KEY) || "secret",
            expiresIn: isRefreshToken ? 3600 : 300,
        });
    }

    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
            });
        } catch {
            throw new BusinessErrorException(MemberErrorCode.INVALID_TOKEN);
        }
    }

    verifyEmail(dto: VerifyEmailDto) {
        return this.membersService.verifyEmail(dto);
    }

    rotateAccessToken(token: string) {
        const decoded = this.verifyToken(token);

        if (decoded.type !== "refresh") {
            throw new BusinessErrorException(
                MemberErrorCode.INVALID_TOKEN_TYPE,
            );
        }

        return this.signToken(
            {
                email: decoded.email,
                id: decoded.sub,
            },
            false,
        );
    }

    updateRefreshToken(memberId: number) {
        return this.membersService.updateRefreshToken(memberId);
    }

    private generateVerificationCode(): string {
        return crypto.randomBytes(3).toString("hex").toUpperCase();
    }
}
