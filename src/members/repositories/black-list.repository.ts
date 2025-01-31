import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BlackListEntity } from "../entities/black-list.entity";

@Injectable()
export class BlackListRepository extends Repository<BlackListEntity> {
    constructor(
        @InjectRepository(BlackListEntity)
        private readonly repository: Repository<BlackListEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    findBlacks(memberId: number) {
        return this.repository.find({
            select: {
                blackerId: true,
                blackedId: true,
            },
            where: {
                blackerId: memberId,
            },
        });
    }

    deleteBlack(blackerId: number, blackedId: number) {
        return this.repository.delete({
            blackerId,
            blackedId,
        });
    }

    createBlack(blackerId: number, blackedId: number) {
        return this.repository.save({
            blackerId,
            blackedId,
        });
    }
}
