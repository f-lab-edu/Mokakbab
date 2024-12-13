import dotenv from "dotenv";
import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

import {
    ENV_DB_DATABASE,
    ENV_DB_PASSWORD,
    ENV_DB_PORT,
    ENV_DB_SOURCE_HOST,
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
    host: process.env[ENV_DB_SOURCE_HOST] || "localhost",
    port: Number(process.env[ENV_DB_PORT]) || 3306,
    username: process.env[ENV_DB_USERNAME] || "root",
    password: process.env[ENV_DB_PASSWORD] || "test",
    database: process.env[ENV_DB_DATABASE] || "test",
    entities: ["src/**/*.entity.ts"],
    logging: true,
    seeds: [`src/database/seeds/**/*{.js,.ts}`],
    factories: [`src/database/factories/**/*{.js,.ts}`],
};

export const dataSource = new DataSource(options);
