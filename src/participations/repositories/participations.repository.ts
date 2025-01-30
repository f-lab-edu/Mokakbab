import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ParticipationStatus } from "@APP/common/enum/participation-status.enum";

import { ParticipationEntity } from "../entities/participation.entity";

@Injectable()
export class ParticipationsRepository extends Repository<ParticipationEntity> {
    constructor(
        @InjectRepository(ParticipationEntity)
        private readonly repository: Repository<ParticipationEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    findAllParticipationsByArticleId(
        articleId: number,
        cursor: number,
        limit: number,
    ) {
        const query = this.repository
            .createQueryBuilder("participation")
            .where(cursor ? "participation.id > :cursor" : "1=1", { cursor })
            .andWhere("participation.articleId = :articleId", {
                articleId,
            })
            .andWhere("participation.status = :status", {
                status: ParticipationStatus.ACTIVE,
            })
            .orderBy("participation.id", "ASC")
            .limit(limit + 1);

        return query.getRawMany();
    }
}
