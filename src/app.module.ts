import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";

import { AppController } from "./app.controller";
import { TypeOrmModuleOptions } from "./common/typeorm";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                path.resolve(process.cwd(), `.${process.env["NODE_ENV"]}.env`),
            ],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
    ],
    controllers: [AppController],
    providers: [],
    exports: [],
})
export class AppModule {}
