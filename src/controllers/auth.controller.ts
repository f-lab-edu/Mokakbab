import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";

import { CurrentMemberDecorator } from "@APP/common/decorators/current-member.decorator";
import { IsPublicDecorator } from "@APP/common/decorators/is-public.decorator";
import { IsPublicEnum } from "@APP/common/enum/is-public.enum";
import { BasicTokenGuard } from "@APP/common/guards/basic-token.guard";
import { RefreshTokenGuard } from "@APP/common/guards/bearer-token.guard";
import { RegisterMemberDto } from "@APP/dtos/register-member.dto";
import { VerifyEmailDto } from "@APP/dtos/verify-email.dto";
import { AuthService } from "@APP/services/auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublicDecorator(IsPublicEnum.PUBLIC)
    @UseGuards(BasicTokenGuard)
    @Post("sign-in")
    async signIn(@Headers("authorization") rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, false);

        const decoded = this.authService.decodeBasicToken(token);

        return await this.authService.signInByEmail(decoded);
    }

    @IsPublicDecorator(IsPublicEnum.PUBLIC)
    @Post("sign-up")
    async signUp(@Body() dto: RegisterMemberDto) {
        return await this.authService.registerByEmail(dto);
    }

    @Post("sign-out")
    signOut(@CurrentMemberDecorator("id") memberId: number) {
        void this.authService.updateRefreshToken(memberId);
    }

    @IsPublicDecorator(IsPublicEnum.PUBLIC)
    @Post("verify-email")
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        return await this.authService.verifyEmail(dto);
    }

    @IsPublicDecorator(IsPublicEnum.REFRESH)
    @UseGuards(RefreshTokenGuard)
    @Post("access-token")
    postAccessToken(@Headers("authorization") rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        return this.authService.rotateAccessToken(token);
    }
}
