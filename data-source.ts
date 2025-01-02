import dotenv from "dotenv";
import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

import {
    ENV_DB_DATABASE,
    ENV_DB_HOST,
    ENV_DB_PASSWORD,
    ENV_DB_PORT,
    ENV_DB_TYPE,
    ENV_DB_USERNAME,
} from "@APP/common/constants/env-keys.const";

dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env["NODE_ENV"] === "production"
            ? ".env"
            : process.env["NODE_ENV"] === "stage"
              ? ".stage.env"
              : ".development.env",
    ),
});

const options: DataSourceOptions & SeederOptions = {
    type: (process.env[ENV_DB_TYPE] as any) || "mysql",
    host: process.env[ENV_DB_HOST] || "localhost",
    port: Number(process.env[ENV_DB_PORT]) || 3306,
    username: process.env[ENV_DB_USERNAME] || "root",
    password: process.env[ENV_DB_PASSWORD] || "test",
    database: process.env[ENV_DB_DATABASE] || "test",
    entities: ["src/**/*.entity.ts"],
    logging: true,
    seeds: [`src/database/seeds/**/*{.js,.ts}`],
    factories: [`src/database/factories/**/*{.js,.ts}`],
    migrations: ["src/database/migrations/*.ts"],
    extra: {
        connectionLimit: 30,
        queueLimit: 0,
        waitForConnections: true,
    },
    // 커넥션 풀 사이즈 설정
    poolSize: 30,
    connectTimeout: 120000,
};

export const dataSource = new DataSource(options);
