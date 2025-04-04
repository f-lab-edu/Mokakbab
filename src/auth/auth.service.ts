import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import {
    ENV_JWT_ACCESS_TOKEN_EXPIRATION,
    ENV_JWT_REFRESH_TOKEN_EXPIRATION,
} from "@APP/common/constants/env-keys.const";
import { BusinessErrorException } from "@APP/common/exception/business-error.exception";
import { MemberErrorCode } from "@APP/common/exception/error-code";
import { RegisterMemberDto } from "@APP/members/dtos/register-member.dto";
import { VerifyEmailDto } from "@APP/members/dtos/verify-email.dto";
import { MemberEntity } from "@APP/members/entities/member.entity";
import { MembersService } from "@APP/members/members.service";

//import { MailsService } from "./mails.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly membersService: MembersService,
        //private readonly mailsService: MailsService,
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
        const existMember = await this.membersService.existByEmail(dto.email);

        if (existMember) {
            throw new BusinessErrorException(
                MemberErrorCode.EMAIL_ALREADY_EXISTS,
            );
        }

        const hashedPassword = await bcrypt.hash(dto.password, 2);
        const verificationCode = this.generateVerificationCode();

        /**
         * 테스트를 위해서 잠시 보류
         */
        // void this.mailsService.sendVerificationEmail(
        //     newMember.email,
        //     verificationCode,
        // );

        return this.membersService.createMember(
            {
                ...dto,
                password: hashedPassword,
            },
            verificationCode,
        );

        /**
         * 로그인 처리 부분을 분리하여 처리
         */
        // return this.signInMember(
        //     await this.membersService.createMember(
        //         {
        //             ...dto,
        //             password: hashedPassword,
        //         },
        //         verificationCode,
        //     ),
        // );
    }

    async registerByEmail2(dto: RegisterMemberDto) {
        const existMember = await this.membersService.existByEmail(dto.email);

        if (existMember) {
            throw new BusinessErrorException(
                MemberErrorCode.EMAIL_ALREADY_EXISTS,
            );
        }

        const verificationCode = this.generateVerificationCode();

        return this.membersService.createMember(
            {
                ...dto,
            },
            verificationCode,
        );
    }

    private async signInMember(member: Pick<MemberEntity, "email" | "id">) {
        const accessTokenPromise = this.signToken(member, false);
        const refreshTokenPromise = this.signToken(member, true);

        const hashedAndSavedRefreshTokenPromise = refreshTokenPromise
            .then((refreshToken) => bcrypt.hash(refreshToken, 2))
            .then((hashedToken) =>
                this.membersService.saveRefreshToken(member.id, hashedToken),
            );

        // 한번에 처리
        const [accessToken, refreshToken] = await Promise.all([
            accessTokenPromise,
            refreshTokenPromise,
            hashedAndSavedRefreshTokenPromise,
        ]);

        return { accessToken, refreshToken };
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

        return this.jwtService.signAsync(payload, {
            expiresIn: isRefreshToken
                ? this.configService.get<string>(
                      ENV_JWT_REFRESH_TOKEN_EXPIRATION,
                  )
                : this.configService.get<string>(
                      ENV_JWT_ACCESS_TOKEN_EXPIRATION,
                  ),
        });
    }

    async verifyToken(token: string) {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch {
            throw new BusinessErrorException(MemberErrorCode.INVALID_TOKEN);
        }
    }

    verifyEmail(dto: VerifyEmailDto) {
        return this.membersService.verifyEmail(dto);
    }

    async rotateAccessToken(token: string) {
        const decoded = await this.verifyToken(token);

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
        const length = 6; // 6자리 인증 코드
        const characters = "0123456789ABCDEF"; // 16진수 문자
        let result = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }

        return result;
    }

    findMemberByEmail(email: string) {
        return this.membersService.findByEmail(email);
    }
}
