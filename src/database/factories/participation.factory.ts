import { setSeederFactory } from "typeorm-extension";

import { ParticipationStatus } from "@APP/common/enum/participation-status.enum";
import { ParticipationEntity } from "@APP/entities/participation.entity";

import { ARTICLE_ID_RANGE } from "../utils/article-id-range.const";
import { MEMBER_ID_RANGE } from "../utils/member-id-range.const";

export default setSeederFactory(ParticipationEntity, async (faker) => {
    const participation = new ParticipationEntity();

    const memberIdRanges = faker.helpers.weightedArrayElement(MEMBER_ID_RANGE);

    const articleRange = faker.helpers.weightedArrayElement(ARTICLE_ID_RANGE);

    participation.memberId = faker.number.int({
        min: memberIdRanges.min,
        max: memberIdRanges.max,
    });

    participation.articleId = faker.number.int({
        min: articleRange.min,
        max: articleRange.max,
    });

    participation.status =
        Math.random() > 0.8
            ? ParticipationStatus.ACTIVE
            : ParticipationStatus.CANCELLED;

    return participation;
});
