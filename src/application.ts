import {
    INestApplication,
    NestApplicationOptions,
    ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { ENV_SERVER_PORT } from "./common/constants/env-keys.const";
import { BusinessErrorFilter } from "./common/filter/business-error.filter";

export namespace Backend {
    export const start = async (
        options: NestApplicationOptions = {},
    ): Promise<INestApplication> => {
        const app = await NestFactory.create(AppModule, options);

        await app
            .useGlobalFilters(new BusinessErrorFilter())
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
            .listen(ENV_SERVER_PORT);

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
