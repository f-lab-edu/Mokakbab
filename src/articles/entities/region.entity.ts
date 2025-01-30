import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ArticleEntity } from "./article.entity";
import { DistrictEntity } from "./district.entity";

@Entity("region")
export class RegionEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @Column({ type: "varchar", length: 50 })
    name!: string;

    @OneToMany(() => DistrictEntity, (district) => district.region)
    districts!: DistrictEntity[];

    @OneToMany(() => ArticleEntity, (article) => article.region)
    articles!: ArticleEntity[];
}
