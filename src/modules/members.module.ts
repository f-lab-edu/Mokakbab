import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MembersController } from "@APP/controllers/members.controller";
import { MemberEntity } from "@APP/entities/member.entity";
import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";
import { VerificationCodeEntity } from "@APP/entities/verification-code.entity";
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
        ]),
    ],
    controllers: [MembersController],
    providers: [
        MembersService,
        MembersRepository,
        RefreshTokenRepository,
        VerificationCodeRepository,
    ],
    exports: [MembersService],
})
export class MembersModule {}
