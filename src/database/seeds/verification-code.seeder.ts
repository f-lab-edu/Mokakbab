import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { VerificationCodeEntity } from "@APP/entities/verification-code.entity";

// export default class VerificationCodeSeeder implements Seeder {
//     public async run(
//         _dataSource: DataSource,
//         factoryManager: SeederFactoryManager,
//     ): Promise<void> {
//         const verificationCodeFactory = factoryManager.get(
//             VerificationCodeEntity,
//         );

//         await verificationCodeFactory.save();

//         console.log(`인증코드 생성 완료`);
//     }
// }

export default class VerificationCodeSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const verificationCodeFactory = factoryManager.get(
            VerificationCodeEntity,
        );
        const queryRunner = dataSource.createQueryRunner();

        const batchSize = 1000;
        const totalCodes = 100000;
        const iterations = Math.ceil(totalCodes / batchSize);

        let totalCreated = 0;

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            for (let i = 0; i < iterations; i++) {
                const verificationCodes = await Promise.all(
                    Array.from({ length: batchSize }, () =>
                        verificationCodeFactory.make(),
                    ),
                );

                const result = await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(VerificationCodeEntity)
                    .values(verificationCodes)
                    .execute();

                totalCreated += result.identifiers.length;
                console.log(
                    `${i + 1}번째 배치 인증코드 생성 완료: ${result.identifiers.length}`,
                );
            }

            await queryRunner.commitTransaction();
            console.log(`총 인증코드 생성 완료: ${totalCreated}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
