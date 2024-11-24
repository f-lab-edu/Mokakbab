import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

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
    @Column({ type: "varchar", length: 60, nullable: false })
    password!: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 2048, nullable: true })
    profileImage?: string;

    @Column({ type: "varchar", length: 60, nullable: true })
    refreshToken?: string;

    @Column({ type: "varchar", length: 60, nullable: true })
    verificationCode?: string;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
