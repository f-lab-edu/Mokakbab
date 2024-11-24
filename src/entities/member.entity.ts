import { Exclude, Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { ArticleLikeEntity } from "./article-like.entity";
import { ArticleEntity } from "./article.entity";
import { ParticipationEntity } from "./participation.entity";

@Entity("member")
export class MemberEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @IsNotEmpty()
    @IsString()
    @Column({ type: "varchar", length: 20, nullable: false })
    name!: string;

    @IsNotEmpty()
    @IsString()
    @Column({ type: "varchar", length: 40, nullable: false })
    nickname!: string;

    @IsNotEmpty()
    @IsString()
    @Exclude({
        toPlainOnly: true,
    })
    @Length(4, 20)
    @Column({ type: "varchar", length: 60, nullable: false })
    password!: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    email!: string;

    @Transform(({ value }) => {
        if (!value) return null;

        return new URL(
            `/public/members/${value}`,
            process.env["API_BASE_URL"],
        ).toString();
    })
    @Column({ type: "varchar", length: 2048, nullable: true })
    profileImage?: string;

    @Column({ type: "varchar", length: 60, nullable: true })
    refreshToken?: string | null;

    @IsNotEmpty()
    @IsString()
    @Column({ type: "varchar", length: 60, nullable: true })
    verificationCode?: string;

    @Column({ type: "boolean", default: false })
    isEmailVerified!: boolean;

    @OneToMany(() => ArticleEntity, (article) => article.member)
    articles!: ArticleEntity[];

    @OneToMany(() => ArticleLikeEntity, (articleLike) => articleLike.member)
    articleLikes!: ArticleLikeEntity[];

    @OneToMany(
        () => ParticipationEntity,
        (participation) => participation.member,
    )
    participations!: ParticipationEntity[];

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
