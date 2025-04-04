import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticlesModule } from "@APP/articles/articles.module";
import { AuthModule } from "@APP/auth/auth.module";

import { ParticipationEntity } from "./entities/participation.entity";
import { ParticipationsController } from "./participations.controller";
import { ParticipationsService } from "./participations.service";
import { ParticipationsRepository } from "./repositories/participations.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([ParticipationEntity]),
        ArticlesModule,
        AuthModule,
    ],
    controllers: [ParticipationsController],
    providers: [ParticipationsService, ParticipationsRepository],
    exports: [],
})
export class ParticipationsModule {}
