import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { AuthService } from "@APP/services/auth.service";

import { BusinessErrorException } from "../exception/business-error.exception";
import { MemberErrorCode } from "../exception/error-code";

@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const rawToken = request.headers["authorization"];

        if (!rawToken)
            throw new BusinessErrorException(MemberErrorCode.TOKEN_NOT_FOUND);

        const token = this.authService.extractTokenFromHeader(rawToken, false);

        const { email, password } = this.authService.decodeBasicToken(token);

        const member = await this.authService.authenticateWithEmailAndPassword({
            email,
            password,
        });

        request.member = member;
        return true;
    }
}
