import { ConfigModule, ConfigService } from "@nestjs/config";

import {
    ENV_MAIL_HOST,
    ENV_MAIL_PORT,
    ENV_MAIL_PWD,
    ENV_MAIL_USER,
} from "../constants/env-keys.const";

export const EmailOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        const option = {
            transport: {
                host: configService.get<string>(ENV_MAIL_HOST) || "localhost",
                port: Number(configService.get<number>(ENV_MAIL_PORT)) || 587,
                secure: false,
                auth: {
                    user: configService.get<string>(ENV_MAIL_USER) || "user",
                    pass: configService.get<string>(ENV_MAIL_PWD) || "password",
                },
            },
        };

        return option;
    },
};
