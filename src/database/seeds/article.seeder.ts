import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { ArticleEntity } from "@APP/entities/article.entity";

export default class ArticleSeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const articleFactory = factoryManager.get(ArticleEntity);

        const articles = await articleFactory.saveMany(1);

        console.log(`게시글 생성 완료 : ${articles.length}`);
    }
}
