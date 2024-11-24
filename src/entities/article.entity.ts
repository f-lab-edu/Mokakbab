import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { ArticleLikeEntity } from "./article-like.entity";
import { CategoryEntity } from "./category.entity";
import { DistrictEntity } from "./district.entity";
import { MemberEntity } from "./member.entity";
import { ParticipationEntity } from "./participation.entity";
import { RegionEntity } from "./region.entity";

@Entity("articles")
export class ArticleEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @IsNotEmpty()
    @IsString()
    @Column({ type: "varchar", length: 100 })
    title!: string;

    @IsNotEmpty()
    @IsString()
    @Column({ type: "text" })
    content!: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    @Column({ type: "datetime" })
    startTime!: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    @Column({ type: "datetime" })
    endTime!: Date;

    @IsNotEmpty()
    @IsNumber()
    @Column({ type: "int" })
    memberId!: number;

    @ManyToOne(() => MemberEntity, (member) => member.articles)
    @JoinColumn({ name: "memberId", referencedColumnName: "id" })
    member!: MemberEntity;

    @IsNotEmpty()
    @IsNumber()
    @Column({ type: "int" })
    categoryId!: number;

    @ManyToOne(() => CategoryEntity, (category) => category.articles)
    @JoinColumn({ name: "categoryId", referencedColumnName: "id" })
    category!: CategoryEntity;

    @IsNotEmpty()
    @IsNumber()
    @Column({ type: "int" })
    regionId!: number;

    @ManyToOne(() => RegionEntity, (region) => region.articles)
    @JoinColumn({ name: "regionId", referencedColumnName: "id" })
    region!: RegionEntity;

    @IsNotEmpty()
    @IsNumber()
    @Column({ type: "int" })
    districtId!: number;

    @ManyToOne(() => DistrictEntity, (district) => district.articles)
    @JoinColumn({ name: "districtId", referencedColumnName: "id" })
    district!: DistrictEntity;

    @OneToMany(() => ArticleLikeEntity, (articleLike) => articleLike.article)
    articleLikes!: ArticleLikeEntity[];

    @OneToMany(
        () => ParticipationEntity,
        (participation) => participation.article,
    )
    participations!: ParticipationEntity[];

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
