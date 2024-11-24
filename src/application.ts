import {
    INestApplication,
    NestApplicationOptions,
    ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
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
            .listen(6000);

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
