import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ParticipationsController } from "@APP/controllers/participations.controller";
import { ParticipationEntity } from "@APP/entities/participation.entity";
import { ParticipationsRepository } from "@APP/repositories/participations.repository";
import { ParticipationsService } from "@APP/services/participations.service";

import { ArticlesModule } from "./articles.module";
import { AuthModule } from "./auth.module";

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
