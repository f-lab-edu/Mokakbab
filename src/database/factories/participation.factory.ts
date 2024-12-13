import { setSeederFactory } from "typeorm-extension";

import { ParticipationStatus } from "@APP/common/enum/participation-status.enum";
import { ParticipationEntity } from "@APP/entities/participation.entity";

export default setSeederFactory(ParticipationEntity, async (faker) => {
    const participation = new ParticipationEntity();

    participation.articleId = faker.number.int({ min: 1, max: 50000 });
    participation.memberId = faker.number.int({ min: 1, max: 100 });
    participation.status =
        Math.random() > 0.8
            ? ParticipationStatus.ACTIVE
            : ParticipationStatus.CANCELLED;

    return participation;
});
