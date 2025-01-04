import { ConfigModule, ConfigService } from "@nestjs/config";
import { PoolOptions } from "mysql2";
import path from "path";
import { LogLevel } from "typeorm";

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
            logging: ["error", "warn"] as LogLevel[],
            extra: {
                connectionLimit: 100,
                waitForConnections: true,
                queueLimit: 0,
            } as PoolOptions,
            // extra: {
            //     waitForConnections: true,
            //     connectionLimit: 200, // MySQL max_connections의 약 20%
            //     maxIdle: 200,
            //     idleTimeout: 60000,
            //     queueLimit: 0,
            //     enableKeepAlive: true,
            //     keepAliveInitialDelay: 10000,
            // } as PoolOptions,

            // ...(configService.get("NODE_ENV") === "development"
            //     ? { retryAttempts: 10, logging: true }
            //     : { logging: false }),
            //connectTimeout: 30000, // 연결 타임아웃
        };

        return option;
    },
};
