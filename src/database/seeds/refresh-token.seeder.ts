import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";

// export default class RefreshTokenSeeder implements Seeder {
//     public async run(
//         _dataSource: DataSource,
//         factoryManager: SeederFactoryManager,
//     ): Promise<void> {
//         const refreshTokenFactory = factoryManager.get(RefreshTokenEntity);

//         await refreshTokenFactory.save();

//         console.log(`리프레시토큰 생성 완료`);
//     }
// }

export default class RefreshTokenSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const refreshTokenFactory = factoryManager.get(RefreshTokenEntity);
        const queryRunner = dataSource.createQueryRunner();

        const batchSize = 1000;
        const totalTokens = 100000;
        const iterations = Math.ceil(totalTokens / batchSize);

        let totalCreated = 0;

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            for (let i = 0; i < iterations; i++) {
                const refreshTokens = await Promise.all(
                    Array.from({ length: batchSize }, () =>
                        refreshTokenFactory.make(),
                    ),
                );

                const result = await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(RefreshTokenEntity)
                    .values(refreshTokens)
                    .execute();

                totalCreated += result.identifiers.length;
                console.log(
                    `${i + 1}번째 배치 리프레시토큰 생성 완료: ${result.identifiers.length}`,
                );
            }

            await queryRunner.commitTransaction();
            console.log(`총 리프레시토큰 생성 완료: ${totalCreated}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
