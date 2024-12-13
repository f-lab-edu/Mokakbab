import { setSeederFactory } from "typeorm-extension";

import { BlackListEntity } from "@APP/entities/black-list.entity";

export default setSeederFactory(BlackListEntity, async (faker) => {
    const blackListEntry = new BlackListEntity();

    let initiatorId = faker.number.int({ min: 1, max: 100 });
    let targetId = faker.number.int({ min: 1, max: 100 });

    // 자기 자신을 블랙 하는것을 방지 하기 위해
    while (initiatorId === targetId) {
        initiatorId = faker.number.int({ min: 1, max: 100 });
        targetId = faker.number.int({ min: 1, max: 100 });
    }

    blackListEntry.blackerId = initiatorId;
    blackListEntry.blackedId = targetId;

    return blackListEntry;
});
