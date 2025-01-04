import { Controller, Get } from "@nestjs/common";

import { IsPublicDecorator } from "./common/decorators/is-public.decorator";
import { IsPublicEnum } from "./common/enum/is-public.enum";

@Controller()
export class AppController {
    constructor() {}

    @Get()
    getHello(): string {
        return "Hello World";
    }

    @IsPublicDecorator(IsPublicEnum.PUBLIC)
    @Get("test")
    getTest(): string {
        return "Test";
    }
}
