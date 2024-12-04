import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { PASSWORD_HASH_LENGTH } from "@APP/common/constants/number.const";

import { RefreshTokenEntity } from "./refresh-token.entity";
import { VerificationCodeEntity } from "./verification-code.entity";

@Entity("member")
export class MemberEntity {
    @PrimaryGeneratedColumn()
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
    refreshToken?: RefreshTokenEntity; // 리프레시토큰

    @OneToOne(
        () => VerificationCodeEntity,
        (verificationCode) => verificationCode.member,
    )
    verificationCode?: VerificationCodeEntity; // 이메일인증코드

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
