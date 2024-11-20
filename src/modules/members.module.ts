import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MemberEntity } from "@APP/entities/member.entity";
import { MembersService } from "@APP/services/members.service";

@Module({
    imports: [TypeOrmModule.forFeature([MemberEntity])],
    controllers: [],
    providers: [MembersService],
    exports: [],
})
export class MembersModule {}
