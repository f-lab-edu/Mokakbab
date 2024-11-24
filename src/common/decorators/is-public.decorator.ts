import { SetMetadata } from "@nestjs/common";

import { IsPublicEnum } from "../enum/is-public.enum";

export const IS_PUBLIC_KEY = "is_public";

export const IsPublicDecorator = (data: IsPublicEnum) =>
    SetMetadata(IS_PUBLIC_KEY, data);
