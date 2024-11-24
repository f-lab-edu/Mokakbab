import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ArticleEntity } from "./article.entity";

@Entity("category")
export class CategoryEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @Column({ type: "varchar", length: 50 })
    name!: string;

    @OneToMany(() => ArticleEntity, (article) => article.category)
    articles!: ArticleEntity[];
}
