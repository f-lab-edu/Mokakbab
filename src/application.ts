import {
    NestApplicationOptions, //ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from "@nestjs/platform-fastify";
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
    ): Promise<NestFastifyApplication> => {
        const app = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter(),
            options,
        );

        await app
            .useGlobalFilters(
                new GlobalExceptionFilter(),
                new BusinessErrorFilter(),
            )
            .listen(process.env[ENV_SERVER_PORT]!, "0.0.0.0"); // fastify에서는 production 환경에서 '0.0.0.0' 설정을 하지 않으면 외부에서 호출이 불가했습니다.

        process.on("SIGINT", async () => {
            await end(app);
            process.exit(0);
        });

        return app;
    };

    export const end = async (app: NestFastifyApplication) => {
        await app.close();
    };
}
