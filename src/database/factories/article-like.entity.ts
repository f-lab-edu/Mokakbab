import { setSeederFactory } from "typeorm-extension";

import { ArticleLikeEntity } from "@APP/entities/article-like.entity";

export default setSeederFactory(ArticleLikeEntity, async (faker) => {
    const articleLike = new ArticleLikeEntity();

    articleLike.articleId = faker.number.int({ min: 1, max: 50000 });
    articleLike.memberId = faker.number.int({ min: 1, max: 100 });

    return articleLike;
});
