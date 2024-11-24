import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { BasicTokenGuard } from "@APP/common/guards/basic-token.guard";
import {
    AccessTokenGuard,
    RefreshTokenGuard,
} from "@APP/common/guards/bearer-token.guard";
import { RegisterMemberDto } from "@APP/dtos/register-member.dto";
import { AuthService } from "@APP/services/auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(BasicTokenGuard)
    @Post("sign-in")
    async signIn(@Headers("authorization") rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, false);

        const decoded = this.authService.decodeBasicToken(token);

        return await this.authService.signInByEmail(decoded);
    }

    @Post("sign-up")
    async signUp(@Body() dto: RegisterMemberDto) {
        return await this.authService.registerByEmail(dto);
    }

    @UseGuards(AccessTokenGuard)
    @Post("sign-out")
    async signOut(@CurrentMemberDecorator("id") memberId: number) {
        await this.authService.updateRefreshToken(memberId);
    }

    @UseGuards(RefreshTokenGuard)
    @Post("access-token")
    async postAccessToken(@Headers("authorization") rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        return this.authService.rotateAccessToken(token);
    }
}
