import { ConfigModule, ConfigService } from "@nestjs/config";
import path from "path";

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
            type: configService.get(ENV_DB_TYPE) || "mysql",
            host: configService.get(ENV_DB_HOST) || "localhost",
            port: Number(configService.get<number>(ENV_DB_PORT)) || 3306,
            username: configService.get(ENV_DB_USERNAME) || "root",
            database: configService.get(ENV_DB_DATABASE) || "test",
            password: configService.get(ENV_DB_PASSWORD) || "test",
            entities: [path.resolve(process.cwd(), "dist/**/*.entity.{js,ts}")],
            synchronize: configService.get<boolean>(ENV_DB_SYNCHRONIZE) || true,
        };

        return option;
    },
};
