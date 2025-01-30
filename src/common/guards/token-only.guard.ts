import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";

import { AuthService } from "@APP/services/auth.service";

@Injectable()
export class TokenOnlyGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const rawToken = request.headers.authorization;

        if (!rawToken) {
            throw new UnauthorizedException("토큰이 없습니다!");
        }

        // 헤더에서 토큰 파싱
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        // 단순히 토큰만 검증, member 정보가 필요 없는 경우 사용
        await this.authService.verifyToken(token);

        return true;
    }
}
