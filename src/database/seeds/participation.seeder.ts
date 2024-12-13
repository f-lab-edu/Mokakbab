import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { ParticipationEntity } from "@APP/entities/participation.entity";

// export default class ParticipationSeeder implements Seeder {
//     public async run(
//         _dataSource: DataSource,
//         factoryManager: SeederFactoryManager,
//     ): Promise<void> {
//         const participationFactory = factoryManager.get(ParticipationEntity);

//         const participations = await participationFactory.saveMany(180000);

//         console.log(`참여 생성 완료 : ${participations.length}`);
//     }
// }

export default class ParticipationSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const participationFactory = factoryManager.get(ParticipationEntity);
        const queryRunner = dataSource.createQueryRunner();

        const batchSize = 1000;
        const totalParticipations = 200000;
        const iterations = Math.ceil(totalParticipations / batchSize);

        let totalCreated = 0;

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            for (let i = 0; i < iterations; i++) {
                const participations = await Promise.all(
                    Array.from({ length: batchSize }, () =>
                        participationFactory.make(),
                    ),
                );

                const result = await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(ParticipationEntity)
                    .values(participations)
                    .orIgnore() // articleId와 memberId의 unique constraint 때문에 추가
                    .execute();

                totalCreated += result.identifiers.length;
                console.log(
                    `${i + 1}번째 배치 참여 생성 완료: ${result.identifiers.length}`,
                );
            }

            await queryRunner.commitTransaction();
            console.log(`총 참여 생성 완료: ${totalCreated}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
