import { setSeederFactory } from "typeorm-extension";

import { ArticleEntity } from "@APP/entities/article.entity";

import { MEMBER_ID_RANGE } from "../utils/member-id-range.const";

// export default setSeederFactory(ArticleEntity, async (faker) => {
//     const article = new ArticleEntity();
//     const startDate = faker.date.recent({ days: 365 });

//     article.title = faker.lorem.sentence();
//     article.content = faker.lorem.paragraph();
//     article.startTime = faker.date.recent({ days: 365 });
//     article.endTime = faker.date.soon({ days: 1, refDate: article.startTime });
//     article.articleImage = faker.image.url();
//     article.memberId = faker.number.int({ min: 1, max: 100 });
//     article.categoryId = faker.number.int({ min: 1, max: 16 });
//     article.regionId = faker.number.int({ min: 1, max: 1 });
//     article.districtId = faker.number.int({ min: 1, max: 129 });
//     article.createdAt = startDate;
//     article.updatedAt = startDate;

//     return article;
// });

export default setSeederFactory(ArticleEntity, async (faker) => {
    const article = new ArticleEntity();
    const startDate = faker.date.recent({ days: 365 });

    const memberIdRanges = faker.helpers.weightedArrayElement(MEMBER_ID_RANGE);

    article.memberId = faker.number.int({
        min: memberIdRanges.min,
        max: memberIdRanges.max,
    });

    article.title = faker.lorem.sentence({ min: 5, max: 10 }).slice(0, 20);
    article.content = faker.lorem.paragraph();
    article.startTime = faker.date.recent({ days: 365 });
    article.endTime = faker.date.soon({ days: 1, refDate: article.startTime });
    article.articleImage = faker.image.url();
    article.categoryId = faker.number.int({ min: 1, max: 16 });
    article.regionId = faker.number.int({ min: 1, max: 1 });
    article.districtId = faker.number.int({ min: 1, max: 129 });
    article.createdAt = startDate;
    article.updatedAt = startDate;

    return article;
});
