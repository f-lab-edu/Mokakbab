import { Controller, Headers, Post, UseGuards } from "@nestjs/common";

import { BasicTokenGuard } from "@APP/common/guards/basic-token.guard";
import { AuthService } from "@APP/services/auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(BasicTokenGuard)
    @Post("sign-in")
    signIn(@Headers("authorization") rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, false);

        const decoded = this.authService.decodeBasicToken(token);

        return this.authService.signInByEmail(decoded);
    }
}
