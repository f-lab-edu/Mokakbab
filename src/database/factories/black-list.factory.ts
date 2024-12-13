import { setSeederFactory } from "typeorm-extension";

import { BlackListEntity } from "@APP/entities/black-list.entity";

import { MEMBER_ID_RANGE } from "../utils/member-id-range.const";

export default setSeederFactory(BlackListEntity, async (faker) => {
    const blackListEntry = new BlackListEntity();

    const memberIdRanges = faker.helpers.weightedArrayElement(MEMBER_ID_RANGE);

    blackListEntry.blackerId = faker.number.int({
        min: memberIdRanges.min,
        max: memberIdRanges.max,
    });

    blackListEntry.blackedId = faker.number.int({
        min: memberIdRanges.min,
        max: memberIdRanges.max,
    });

    return blackListEntry;
});
