import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "@APP/controllers/auth.controller";
import { AuthService } from "@APP/services/auth.service";

import { MembersModule } from "./members.module";

@Module({
    imports: [JwtModule.register({}), MembersModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [],
})
export class AuthModule {}
