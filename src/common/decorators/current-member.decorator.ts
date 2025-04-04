import {
    ExecutionContext,
    UnauthorizedException,
    createParamDecorator,
} from "@nestjs/common";

import { MemberEntity } from "@APP/members/entities/member.entity";

export const CurrentMemberDecorator = createParamDecorator(
    (data: keyof MemberEntity, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const member = request.member;

        if (!member) throw new UnauthorizedException("회원 정보가 없습니다!");

        return data ? member[data] : member;
    },
);
