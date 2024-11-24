import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MembersController } from "@APP/controllers/members.controller";
import { MemberEntity } from "@APP/entities/member.entity";
import { MembersRepository } from "@APP/repositories/members.repository";
import { MembersService } from "@APP/services/members.service";

@Module({
    imports: [TypeOrmModule.forFeature([MemberEntity])],
    controllers: [MembersController],
    providers: [MembersService, MembersRepository],
    exports: [MembersService],
})
export class MembersModule {}
