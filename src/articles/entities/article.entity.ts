import { Transform, Type } from "class-transformer";
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";
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

import { MemberEntity } from "@APP/members/entities/member.entity";
import { ParticipationEntity } from "@APP/participations/entities/participation.entity";

import { ArticleLikeEntity } from "./article-like.entity";
import { CategoryEntity } from "./category.entity";
import { DistrictEntity } from "./district.entity";
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

    @Transform(
        ({ value }) => {
            if (!value) return null;

            const bucketUrl = process.env["N_BUCKET_URL"];
            return `${bucketUrl}/articles/${process.env["NODE_ENV"]}/thumbnail/${value}`;
        },
        { toPlainOnly: true },
    )
    @IsOptional()
    @Column({ type: "varchar", length: 2048, nullable: true })
    articleImage?: string;

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

    /**
     * 좋아요 수의 Join을 줄이기 위해서 총 좋아요 수 칼럼을 추가 했습니다
     */
    @Column({ type: "int", default: 0 })
    articleLikeCount!: number;

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
