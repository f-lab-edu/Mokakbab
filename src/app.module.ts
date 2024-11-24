import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TypeOrmModuleOptions } from "./common/typeorm";
import { AuthModule } from "./modules/auth.module";
import { MembersModule } from "./modules/members.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`${__dirname}/../.${process.env["NODE_ENV"]}.env`],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        MembersModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
