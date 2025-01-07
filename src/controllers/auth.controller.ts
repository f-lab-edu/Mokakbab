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
    signIn(@Headers("authorization") rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, false);

        const decoded = this.authService.decodeBasicToken(token);

        return this.authService.signInByEmail(decoded);
    }

    @IsPublicDecorator(IsPublicEnum.PUBLIC)
    @Post("sign-up")
    signUp(@Body() dto: RegisterMemberDto) {
        return this.authService.registerByEmail(dto);
    }

    @Post("sign-out")
    signOut(@CurrentMemberDecorator("id") memberId: number) {
        return this.authService.updateRefreshToken(memberId);
    }

    @IsPublicDecorator(IsPublicEnum.PUBLIC)
    @Post("verify-email")
    verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto);
    }

    @IsPublicDecorator(IsPublicEnum.REFRESH)
    @UseGuards(RefreshTokenGuard)
    @Post("access-token")
    postAccessToken(@Headers("authorization") rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        return this.authService.rotateAccessToken(token);
    }
}
