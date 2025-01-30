import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule, getDataSourceToken } from "@nestjs/typeorm";
import { ClsModule } from "nestjs-cls";
import path from "path";

import { TypeOrmModuleOptions } from "@APP/common/typeorm";

import { AppController } from "./app.controller";
import { ArticlesModule } from "./articles/articles.module";
import { AuthModule } from "./auth/auth.module";
import { EmailOptions } from "./common/config/email-config";
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

        ClsModule.forRoot({
            plugins: [
                new ClsPluginTransactional({
                    imports: [TypeOrmModule.forRootAsync(TypeOrmModuleOptions)],
                    adapter: new TransactionalAdapterTypeOrm({
                        dataSourceToken: getDataSourceToken(),
                    }),
                }),
            ],
        }),
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
