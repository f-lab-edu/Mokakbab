import { ConfigModule, ConfigService } from "@nestjs/config";

import {
    ENV_DB_DATABASE,
    ENV_DB_HOST,
    ENV_DB_PASSWORD,
    ENV_DB_PORT,
    ENV_DB_SYNCHRONIZE,
    ENV_DB_TYPE,
    ENV_DB_USERNAME,
} from "../constants/env-keys.const";

export const TypeOrmModuleOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        const option = {
            type: configService.get(ENV_DB_TYPE),
            host: configService.get(ENV_DB_HOST),
            port: Number(configService.get<number>(ENV_DB_PORT)),
            username: configService.get(ENV_DB_USERNAME),
            database: configService.get(ENV_DB_DATABASE),
            password: configService.get(ENV_DB_PASSWORD),
            entities: [__dirname + "/../../**/*.entity.{js,ts}"],
            synchronize: configService.get<boolean>(ENV_DB_SYNCHRONIZE),
        };

        return option;
    },
};
