import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { MemberEntity } from "@APP/entities/member.entity";

//import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";

export default class MemberSeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const memberFactory = factoryManager.get(MemberEntity);

        // const refreshTokenFactory = factoryManager.get(RefreshTokenEntity);

        // const refreshToken = await refreshTokenFactory.save();

        // const member = await memberFactory.save({
        //     refreshToken: refreshToken,
        // });

        const members = await memberFactory.saveMany(1);

        console.log(`멤버 생성 완료 : ${members.length}`);
    }
}
