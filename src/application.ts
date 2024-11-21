import { INestApplication, NestApplicationOptions } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

export namespace Backend {
    export const start = async (
        options: NestApplicationOptions = {},
    ): Promise<INestApplication> => {
        const app = await NestFactory.create(AppModule, options);

        await app.listen(6000);
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
