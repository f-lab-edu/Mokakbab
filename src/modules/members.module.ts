import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MemberEntity } from "@APP/entities/member.entity";
import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";
import { MembersRepository } from "@APP/repositories/members.repository";
import { RefreshTokenRepository } from "@APP/repositories/refresh-token.repository";
import { MembersService } from "@APP/services/members.service";

@Module({
    imports: [TypeOrmModule.forFeature([MemberEntity, RefreshTokenEntity])],
    controllers: [],
    providers: [MembersService, MembersRepository, RefreshTokenRepository],
    exports: [MembersService],
})
export class MembersModule {}
