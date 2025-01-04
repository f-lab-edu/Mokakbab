import {
    INestApplication,
    NestApplicationOptions,
    ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import dotenv from "dotenv";
import path from "path";

import { AppModule } from "./app.module";
import { ENV_SERVER_PORT } from "./common/constants/env-keys.const";
import { BusinessErrorFilter } from "./common/filter/business-error.filter";
import { GlobalExceptionFilter } from "./common/filter/global-exception.filter";

dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env["NODE_ENV"] === "production"
            ? ".production.env"
            : process.env["NODE_ENV"] === "stage"
              ? ".stage.env"
              : ".development.env",
    ),
});

export namespace Backend {
    export const start = async (
        options: NestApplicationOptions = {},
    ): Promise<INestApplication> => {
        const app = await NestFactory.create(AppModule, options);

        await app
            .useGlobalFilters(
                new GlobalExceptionFilter(),
                new BusinessErrorFilter(),
            )
            .useGlobalPipes(
                new ValidationPipe({
                    transform: true,
                    transformOptions: {
                        enableImplicitConversion: false,
                    },
                    stopAtFirstError: true,
                    whitelist: true,
                    forbidNonWhitelisted: true,
                }),
            )
            .listen(process.env[ENV_SERVER_PORT]!);

        process.on("SIGINT", async () => {
            await end(app);
            process.exit(0);
        });

        return app;
    };

    export const end = async (app: INestApplication) => {
        await app.close();
    };
}
