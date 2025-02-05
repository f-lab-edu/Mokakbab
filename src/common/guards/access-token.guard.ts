import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";

import { AuthService } from "@APP/auth/auth.service";

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const rawToken = request.headers.authorization;

        if (!rawToken) {
            throw new UnauthorizedException("토큰이 없습니다!");
        }

        // 헤더에서 토큰 파싱
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const { email } = await this.authService.verifyToken(token);

        const member = await this.authService.findMemberByEmail(email);

        if (!member)
            throw new UnauthorizedException("존재하지 않는 회원입니다!");

        request.member = member;

        return true;
    }
}
