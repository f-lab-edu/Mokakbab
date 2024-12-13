import { setSeederFactory } from "typeorm-extension";

import { CategoryEntity } from "@APP/entities/category.entity";

export default setSeederFactory(CategoryEntity, async () => {
    const category = new CategoryEntity();

    return category;
});
