import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { ArticleLikeEntity } from "@APP/entities/article-like.entity";

// export default class ArticleLikeSeeder implements Seeder {
//     public async run(
//         _dataSource: DataSource,
//         factoryManager: SeederFactoryManager,
//     ): Promise<void> {
//         const articleLikeFactory = factoryManager.get(ArticleLikeEntity);

//         await articleLikeFactory.saveMany(180000);

//         console.log(`게시글 좋아요 생성 완료`);
//     }
// }

export default class ArticleLikeSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const articleLikeFactory = factoryManager.get(ArticleLikeEntity);
        const queryRunner = dataSource.createQueryRunner();

        const batchSize = 1000;
        const totalLikes = 100000;
        const iterations = Math.ceil(totalLikes / batchSize);

        let totalCreated = 0;

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            for (let i = 0; i < iterations; i++) {
                const articleLikes = await Promise.all(
                    Array.from({ length: batchSize }, () =>
                        articleLikeFactory.make(),
                    ),
                );

                const result = await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(ArticleLikeEntity)
                    .values(articleLikes)
                    .orIgnore()
                    .execute();

                totalCreated += result.identifiers.length;
                console.log(
                    `${i + 1}번째 배치 게시글 좋아요 생성 완료: ${result.identifiers.length}`,
                );
            }

            await queryRunner.commitTransaction();
            console.log(`총 게시글 좋아요 생성 완료: ${totalCreated}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
