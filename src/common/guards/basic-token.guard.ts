import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";

import { AuthService } from "@APP/services/auth.service";

@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const rawToken = request.headers["authorization"];

        if (!rawToken) throw new UnauthorizedException("토큰이 없습니다!");

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
