import { Controller, Headers, Post, UseGuards } from "@nestjs/common";

import { BasicTokenGuard } from "@APP/common/guards/basic-token.guard";

@Controller("auth")
export class AuthController {
    constructor() {}

    @UseGuards(BasicTokenGuard)
    @Post("sign-in")
    signIn(@Headers("authorization") rawToken: string) {
        return rawToken;
    }
}
