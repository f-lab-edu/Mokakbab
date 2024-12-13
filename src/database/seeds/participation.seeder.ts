import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { ParticipationEntity } from "@APP/entities/participation.entity";

export default class ParticipationSeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const participationFactory = factoryManager.get(ParticipationEntity);

        const participations = await participationFactory.saveMany(180000);

        console.log(`참여 생성 완료 : ${participations.length}`);
    }
}
