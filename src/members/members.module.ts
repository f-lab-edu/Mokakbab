import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MulterBuilder } from "@APP/common/builders/multer.builder";

import { BlackListEntity } from "./entities/black-list.entity";
import { MemberEntity } from "./entities/member.entity";
import { RefreshTokenEntity } from "./entities/refresh-token.entity";
import { VerificationCodeEntity } from "./entities/verification-code.entity";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";
import { BlackListRepository } from "./repositories/black-list.repository";
import { MembersRepository } from "./repositories/members.repository";
import { RefreshTokenRepository } from "./repositories/refresh-token.repository";
import { VerificationCodeRepository } from "./repositories/verification-code.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MemberEntity,
            RefreshTokenEntity,
            VerificationCodeEntity,
            BlackListEntity,
        ]),

        MulterModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new MulterBuilder(configService)
                    .setResource("members")
                    .setPath("/profile")
                    .build();
            },
        }),
    ],
    controllers: [MembersController],
    providers: [
        MembersService,
        MembersRepository,
        RefreshTokenRepository,
        VerificationCodeRepository,
        BlackListRepository,
    ],
    exports: [MembersService],
})
export class MembersModule {}
