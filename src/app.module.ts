import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";

import { AppController } from "./app.controller";
import { ArticlesModule } from "./articles/articles.module";
import { AuthModule } from "./auth/auth.module";
import { EmailOptions } from "./common/config/email-config";
import { TypeOrmModuleOptions } from "./common/typeorm";
import { MembersModule } from "./members/members.module";
import { ParticipationsModule } from "./participations/participations.module";

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
        ArticlesModule,
        ParticipationsModule,
    ],
    controllers: [AppController],
    providers: [],
    exports: [],
})
export class AppModule {}
