import { setSeederFactory } from "typeorm-extension";

import { RegionEntity } from "@APP/entities/region.entity";

export default setSeederFactory(RegionEntity, () => {
    const regionEntity = new RegionEntity();

    return regionEntity;
});
