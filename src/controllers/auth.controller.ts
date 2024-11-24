import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";

import { BasicTokenGuard } from "@APP/common/guards/basic-token.guard";
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
}
