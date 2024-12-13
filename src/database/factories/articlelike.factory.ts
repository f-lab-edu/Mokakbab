import { setSeederFactory } from "typeorm-extension";

import { ArticleLikeEntity } from "@APP/entities/article-like.entity";

import { ARTICLE_ID_RANGE } from "../utils/article-id-range.const";
import { MEMBER_ID_RANGE } from "../utils/member-id-range.const";

// export default setSeederFactory(ArticleLikeEntity, async () => {
//     const articleLike = new ArticleLikeEntity();

//     articleLike.articleId = 10000;
//     articleLike.memberId = 10000;

//     return articleLike;
// });

export default setSeederFactory(ArticleLikeEntity, async (faker) => {
    const articleLike = new ArticleLikeEntity();

    const memberIdRanges = faker.helpers.weightedArrayElement(MEMBER_ID_RANGE);

    const articleRange = faker.helpers.weightedArrayElement(ARTICLE_ID_RANGE);

    articleLike.memberId = faker.number.int({
        min: memberIdRanges.min,
        max: memberIdRanges.max,
    });

    articleLike.articleId = faker.number.int({
        min: articleRange.min,
        max: articleRange.max,
    });

    return articleLike;
});
