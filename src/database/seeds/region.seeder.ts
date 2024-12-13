import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { RegionEntity } from "@APP/entities/region.entity";

const REGION_NAMES = ["서울특별시", "경기도"];

export default class RegionSeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const regionFactory = factoryManager.get(RegionEntity);

        await Promise.all(
            REGION_NAMES.map((name) => regionFactory.save({ name })),
        );

        console.log(`지역 도분류 생성 완료`);
    }
}
