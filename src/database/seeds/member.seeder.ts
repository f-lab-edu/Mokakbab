import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { MemberEntity } from "@APP/entities/member.entity";

// export default class MemberSeeder implements Seeder {
//     public async run(
//         _dataSource: DataSource,
//         factoryManager: SeederFactoryManager,
//     ): Promise<void> {
//         const memberFactory = factoryManager.get(MemberEntity);
//         const batchSize = 30_00;
//         const totalMembers = 300_00;
//         const iterations = totalMembers / batchSize;

//         let totalCreated = 0;

//         for (let i = 0; i < iterations; i++) {
//             const members = await memberFactory.saveMany(batchSize);
//             totalCreated += members.length;
//             console.log(`${i + 1}번째 배치 멤버 생성 완료: ${members.length}`);
//         }

//         console.log(`총 멤버 생성 완료: ${totalCreated}`);
//     }
// }

export default class MemberSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const memberFactory = factoryManager.get(MemberEntity);
        const queryRunner = dataSource.createQueryRunner();

        const batchSize = 1000;
        const totalMembers = 100000;
        const iterations = Math.ceil(totalMembers / batchSize);

        let totalCreated = 0;

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            for (let i = 0; i < iterations; i++) {
                const members = await Promise.all(
                    Array.from({ length: batchSize }, () =>
                        memberFactory.make(),
                    ),
                );

                const result = await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(MemberEntity)
                    .values(members)
                    .execute();

                totalCreated += result.identifiers.length;
                console.log(
                    `${i + 1}번째 배치 멤버 생성 완료: ${result.identifiers.length}`,
                );
            }

            await queryRunner.commitTransaction();
            console.log(`총 멤버 생성 완료: ${totalCreated}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
