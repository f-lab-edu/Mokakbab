import { Controller, Get } from "@nestjs/common";

import { IsPublicDecorator } from "./common/decorators/is-public.decorator";
import { IsPublicEnum } from "./common/enum/is-public.enum";

@Controller()
export class AppController {
    constructor() {}

    @Get()
    @IsPublicDecorator(IsPublicEnum.PUBLIC)
    getHello(): string {
        return "Hello World";
    }
}
