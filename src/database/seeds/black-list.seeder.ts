import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { BlackListEntity } from "@APP/entities/black-list.entity";

// export default class BlackListSeeder implements Seeder {
//     public async run(
//         _dataSource: DataSource,
//         factoryManager: SeederFactoryManager,
//     ): Promise<void> {
//         const blackListFactory = factoryManager.get(BlackListEntity);

//         await blackListFactory.saveMany(10000);

//         console.log(`블랙 리스트 생성 완료`);
//     }
// }

export default class BlackListSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const blackListFactory = factoryManager.get(BlackListEntity);
        const queryRunner = dataSource.createQueryRunner();

        const batchSize = 100;
        const totalBlackLists = 8000;
        const iterations = Math.ceil(totalBlackLists / batchSize);

        let totalCreated = 0;

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            for (let i = 0; i < iterations; i++) {
                const blackLists = await Promise.all(
                    Array.from({ length: batchSize }, () =>
                        blackListFactory.make(),
                    ),
                );

                const result = await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(BlackListEntity)
                    .values(blackLists)
                    .orIgnore() // blackerId와 blackedId의 unique constraint 때문에 추가
                    .execute();

                totalCreated += result.identifiers.length;
                console.log(
                    `${i + 1}번째 배치 블랙리스트 생성 완료: ${result.identifiers.length}`,
                );
            }

            await queryRunner.commitTransaction();
            console.log(`총 블랙리스트 생성 완료: ${totalCreated}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
