import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";

import { EmailOptions } from "./common/config/email-config";
import { TypeOrmModuleOptions } from "./common/typeorm";
import { AuthModule } from "./modules/auth.module";
import { MembersModule } from "./modules/members.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [
                path.resolve(process.cwd(), `.${process.env["NODE_ENV"]}.env`),
            ],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        MembersModule,
        AuthModule,
        MailerModule.forRootAsync(EmailOptions),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
