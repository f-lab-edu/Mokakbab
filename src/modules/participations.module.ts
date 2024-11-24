import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ParticipationsController } from "@APP/controllers/participations.controller";
import { ParticipationEntity } from "@APP/entities/participation.entity";
import { ParticipationRepository } from "@APP/repositories/participation.repository";
import { ParticipationsService } from "@APP/services/participations.service";

import { ArticlesModule } from "./articles.module";

@Module({
    imports: [TypeOrmModule.forFeature([ParticipationEntity]), ArticlesModule],
    controllers: [ParticipationsController],
    providers: [ParticipationsService, ParticipationRepository],
    exports: [],
})
export class ParticipationsModule {}
