import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";

import { AuthService } from "@APP/services/auth.service";
import { MembersService } from "@APP/services/members.service";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly membersService: MembersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const rawToken = request.headers.authorization;

        if (!rawToken) throw new UnauthorizedException("토큰이 없습니다!");

        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const result = await this.authService.verifyToken(token);

        const member = await this.membersService.findOneByEmail(result.email);

        if (!member)
            throw new UnauthorizedException("존재하지 않는 회원입니다!");

        request.member = member;
        request.tokenType = result.type;

        return true;
    }
}

export class AccessTokenGuard extends BearerTokenGuard {
    override async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.tokenType !== "access") {
            throw new UnauthorizedException("Access Token이 아닙니다.");
        }

        return true;
    }
}

export class RefreshTokenGuard extends BearerTokenGuard {
    override async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.tokenType !== "refresh") {
            throw new UnauthorizedException("Refresh Token이 아닙니다.");
        }

        return true;
    }
}
