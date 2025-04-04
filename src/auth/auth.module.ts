import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { createSecretKey } from "crypto";

import {
    ENV_JWT_ACCESS_TOKEN_EXPIRATION,
    ENV_JWT_SECRET_KEY,
} from "@APP/common/constants/env-keys.const";
import { TokenOnlyGuard } from "@APP/common/guards/token-only.guard";
import { MailsService } from "@APP/mails/mails.service";
import { MembersModule } from "@APP/members/members.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const secretKeyString =
                    configService.get<string>(ENV_JWT_SECRET_KEY) || "secret";

                const keyObject = createSecretKey(Buffer.from(secretKeyString));

                return {
                    secret: keyObject as unknown as string,

                    signOptions: {
                        expiresIn: configService.get<string>(
                            ENV_JWT_ACCESS_TOKEN_EXPIRATION,
                        ),
                    },
                };
            },
        }),
        MembersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, MailsService, TokenOnlyGuard],
    exports: [AuthService, TokenOnlyGuard, MembersModule],
})
export class AuthModule {}
