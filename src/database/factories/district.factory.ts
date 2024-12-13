import { setSeederFactory } from "typeorm-extension";

import { DistrictEntity } from "@APP/entities/district.entity";

export default setSeederFactory(DistrictEntity, () => {
    const districtEntity = new DistrictEntity();

    return districtEntity;
});
