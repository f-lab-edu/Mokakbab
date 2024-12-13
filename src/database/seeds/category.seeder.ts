import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { CategoryEntity } from "@APP/entities/category.entity";

const CATEGORY_NAMES = [
    "치킨",
    "고기",
    "한식",
    "중식",
    "일식",
    "양식",
    "족발,보쌈",
    "찜,탕,찌개",
    "피자",
    "아시안",
    "도시락",
    "분식",
    "카페,디저트",
    "패스트푸드",
    "야식",
    "기타",
];

export default class CategorySeeder implements Seeder {
    public async run(
        _dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const categoryFactory = factoryManager.get(CategoryEntity);

        await Promise.all(
            CATEGORY_NAMES.map((name) => categoryFactory.save({ name })),
        );

        console.log(`카테고리 생성 완료`);
    }
}
