import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MulterBuilder } from "@APP/common/builders/multer.builder";
import { MembersController } from "@APP/controllers/members.controller";
import { BlackListEntity } from "@APP/entities/black-list.entity";
import { MemberEntity } from "@APP/entities/member.entity";
import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";
import { VerificationCodeEntity } from "@APP/entities/verification-code.entity";
import { BlackListRepository } from "@APP/repositories/black-list.repository";
import { MembersRepository } from "@APP/repositories/members.repository";
import { RefreshTokenRepository } from "@APP/repositories/refresh-token.repository";
import { VerificationCodeRepository } from "@APP/repositories/verification-code.repository";
import { MembersService } from "@APP/services/members.service";

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
