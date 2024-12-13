import { setSeederFactory } from "typeorm-extension";

import { ArticleEntity } from "@APP/entities/article.entity";

export default setSeederFactory(ArticleEntity, async (faker) => {
    const article = new ArticleEntity();
    const startDate = faker.date.recent({ days: 365 });

    article.title = faker.lorem.sentence();
    article.content = faker.lorem.paragraph();
    article.startTime = faker.date.recent({ days: 365 });
    article.endTime = faker.date.soon({ days: 1, refDate: article.startTime });
    article.articleImage = faker.image.url();
    article.memberId = faker.number.int({ min: 1, max: 100 });
    article.categoryId = faker.number.int({ min: 1, max: 16 });
    article.regionId = faker.number.int({ min: 1, max: 2 });
    article.districtId = faker.number.int({ min: 1, max: 129 });
    article.createdAt = startDate;
    article.updatedAt = startDate;

    return article;
});
