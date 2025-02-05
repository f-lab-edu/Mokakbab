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
        return this.repository.query(
            `
                SELECT 
                    participation.id AS participation_id,
                    participation.memberId AS participation_memberId,
                    participation.articleId AS participation_articleId,
                    participation.status AS participation_status,
                    participation.createdAt AS participation_createdAt
                FROM participation
                WHERE ${cursor ? "participation.id > ? AND" : ""} participation.articleId = ?
                    AND participation.status = ?
                ORDER BY participation.id ASC
                LIMIT ?
            `,
            cursor
                ? [cursor, articleId, ParticipationStatus.ACTIVE, limit + 1]
                : [articleId, ParticipationStatus.ACTIVE, limit + 1],
        );
    }

    findAllParticipationsByMemberId(
        memberId: number,
        cursor: number,
        limit: number,
    ) {
        const query = this.repository
            .createQueryBuilder("participation")
            .where(cursor ? "participation.id > :cursor" : "1=1", { cursor })
            .andWhere("participation.memberId = :memberId", {
                memberId,
            })
            .andWhere("participation.status = :status", {
                status: ParticipationStatus.ACTIVE,
            })
            .orderBy("participation.id", "ASC")
            .take(limit + 1);

        return query.getRawMany();
    }

    findOneParticipationByParticipationId(
        participationId: number,
        currentMemberId: number,
    ) {
        return this.repository.findOne({
            where: { id: participationId, memberId: currentMemberId },
        });
    }

    createParticipation(articleId: number, memberId: number) {
        return this.repository
            .createQueryBuilder()
            .insert()
            .into(ParticipationEntity)
            .updateEntity(false)
            .values({ articleId, memberId })
            .useTransaction(true)
            .execute();
    }

    updateParticipation(
        participationId: number,
        memberId: number,
        status: ParticipationStatus,
    ) {
        return this.repository.update(
            { id: participationId, memberId },
            { status },
        );
    }
}
