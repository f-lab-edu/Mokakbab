import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { ArticleEntity } from "@APP/entities/article.entity";

// export default class ArticleSeeder implements Seeder {
//     public async run(
//         _dataSource: DataSource,
//         factoryManager: SeederFactoryManager,
//     ): Promise<void> {
//         const articleFactory = factoryManager.get(ArticleEntity);

//         const batchSize = 30_00;
//         const totalArticles = 300_00;
//         const iterations = totalArticles / batchSize;

//         let totalCreated = 0;

//         for (let i = 0; i < iterations; i++) {
//             const articles = await articleFactory.saveMany(batchSize);
//             totalCreated += articles.length;
//             console.log(
//                 `${i + 1}번째 배치 게시글 생성 완료: ${articles.length}`,
//             );
//         }

//         console.log(`총 게시글 생성 완료: ${totalCreated}`);
//     }
// }

export default class ArticleSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const articleFactory = factoryManager.get(ArticleEntity);
        const queryRunner = dataSource.createQueryRunner();

        const batchSize = 1000;
        const totalArticles = 100000;
        const iterations = Math.ceil(totalArticles / batchSize);

        let totalCreated = 0;

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            for (let i = 0; i < iterations; i++) {
                const articles = await Promise.all(
                    Array.from({ length: batchSize }, () =>
                        articleFactory.make(),
                    ),
                );

                const result = await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(ArticleEntity)
                    .values(articles)
                    .orIgnore()
                    .execute();

                totalCreated += result.identifiers.length;
                console.log(
                    `${i + 1}번째 배치 게시글 생성 완료: ${result.identifiers.length}`,
                );
            }

            await queryRunner.commitTransaction();
            console.log(`총 게시글 생성 완료: ${totalCreated}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
