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
            keepAliveInitialDelay: 10000, // Keep-Alive 딜레이
            enableKeepAlive: true,
            extra: {
                connectionLimit: 200, // MySQL max_connections의 약 20%
                queueLimit: 500, // 대기열 크기를 줄여 불필요한 대기 요청 방지
                waitForConnections: true,
                connectTimeout: 30000, // 연결 타임아웃
                acquireTimeout: 30000, // 풀에서 커넥션 획득 타임아웃
            },
            ...(configService.get("NODE_ENV") === "development"
                ? { retryAttempts: 10, logging: true }
                : { logging: false }),
        };

        return option;
    },
};
