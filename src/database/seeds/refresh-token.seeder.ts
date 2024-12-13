import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";

export default class RefreshTokenSeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const refreshTokenFactory = factoryManager.get(RefreshTokenEntity);

        await refreshTokenFactory.save();

        console.log(`리프레시토큰 생성 완료`);
    }
}
