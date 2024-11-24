import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { ArticleEntity } from "./article.entity";
import { RegionEntity } from "./region.entity";

@Entity("district")
export class DistrictEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @Column({ type: "varchar", length: 50 })
    name!: string;

    @Column({ type: "int" })
    regionId!: number;

    @ManyToOne(() => RegionEntity, (region) => region.districts)
    @JoinColumn({ name: "regionId", referencedColumnName: "id" })
    region!: RegionEntity;

    @OneToMany(() => ArticleEntity, (article) => article.district)
    articles!: ArticleEntity[];
}
