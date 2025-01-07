import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as bcrypt from "bcrypt";

import { AuthService } from "@APP/services/auth.service";
import { MembersService } from "@APP/services/members.service";

import { IS_PUBLIC_KEY } from "../decorators/is-public.decorator";
import { IsPublicEnum } from "../enum/is-public.enum";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly membersService: MembersService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass,
        ]);

        if (isPublic) {
            request.isPublic = isPublic;
        }

        if (isPublic === IsPublicEnum.PUBLIC) {
            return true;
        }

        const rawToken = request.headers.authorization;

        if (!rawToken) throw new UnauthorizedException("토큰이 없습니다!");

        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const result = await this.authService.verifyToken(token);

        const member = await this.membersService.findOneByEmail(result.email);

        if (!member)
            throw new UnauthorizedException("존재하지 않는 회원입니다!");

        request.member = member;
        request.tokenType = result.type;
        request.token = token;

        return true;
    }
}

export class AccessTokenGuard extends BearerTokenGuard {
    override async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (
            req.isPublic === IsPublicEnum.PUBLIC ||
            req.isPublic === IsPublicEnum.REFRESH
        ) {
            return true;
        }

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

        const refreshToken = req.token;

        const compareOk = await bcrypt.compare(
            refreshToken,
            req.member.refreshToken?.token,
        );

        if (!compareOk)
            throw new UnauthorizedException("유효하지 않은 토큰입니다.");

        return true;
    }
}
