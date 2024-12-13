import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { BlackListEntity } from "@APP/entities/black-list.entity";

export default class BlackListSeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const blackListFactory = factoryManager.get(BlackListEntity);

        await blackListFactory.saveMany(10000);

        console.log(`블랙 리스트 생성 완료`);
    }
}
