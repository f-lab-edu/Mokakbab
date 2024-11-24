import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { PASSWORD_HASH_LENGTH } from "@APP/common/constants/number.const";

import { ArticleLikeEntity } from "./article-like.entity";
import { ArticleEntity } from "./article.entity";
import { RefreshTokenEntity } from "./refresh-token.entity";
import { VerificationCodeEntity } from "./verification-code.entity";

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
    @Column({ type: "varchar", length: PASSWORD_HASH_LENGTH, nullable: false })
    password!: string; // 비밀번호

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 2048, nullable: true })
    profileImage?: string;

    @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.member)
    @JoinColumn()
    refreshToken?: RefreshTokenEntity; // 리프레시토큰

    @OneToOne(
        () => VerificationCodeEntity,
        (verificationCode) => verificationCode.member,
    )
    @JoinColumn()
    verificationCode?: VerificationCodeEntity; // 이메일인증코드

    @Column({ type: "boolean", default: false })
    isEmailVerified!: boolean;

    @OneToMany(() => ArticleEntity, (article) => article.member)
    articles!: ArticleEntity[];

    @OneToMany(() => ArticleLikeEntity, (articleLike) => articleLike.member)
    articleLikes!: ArticleLikeEntity[];

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
