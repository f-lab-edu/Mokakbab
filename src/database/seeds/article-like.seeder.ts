import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { ArticleLikeEntity } from "@APP/entities/article-like.entity";

export default class ArticleSeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const articleLikeFactory = factoryManager.get(ArticleLikeEntity);

        const articleLikes = await articleLikeFactory.saveMany(180000);

        console.log(`게시글 좋아요 생성 완료 : ${articleLikes.length}`);
    }
}
