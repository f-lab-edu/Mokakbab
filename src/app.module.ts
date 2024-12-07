import { MailerModule } from "@nestjs-modules/mailer";
import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";

import { EmailOptions } from "./common/config/email-config";
import { AccessTokenGuard } from "./common/guards/bearer-token.guard";
import { TypeOrmModuleOptions } from "./common/typeorm";
import { ArticlesModule } from "./modules/articles.module";
import { AuthModule } from "./modules/auth.module";
import { MembersModule } from "./modules/members.module";
import { ParticipationsModule } from "./modules/participations.module";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: path.resolve(process.cwd(), "uploads"),
            serveRoot: "/public",
        }),
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
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard,
        },
    ],
    exports: [],
})
export class AppModule {}
