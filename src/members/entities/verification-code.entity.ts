import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { MemberEntity } from "./member.entity";

@Entity("verification_code")
export class VerificationCodeEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 60, nullable: false })
    code!: string; // 이메일인증코드

    @OneToOne(() => MemberEntity, (member) => member.verificationCode)
    member!: MemberEntity; // 회원 엔티티와의 관계

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
