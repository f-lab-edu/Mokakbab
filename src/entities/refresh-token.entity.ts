import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { MemberEntity } from "./member.entity";

@Entity("refresh_token")
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 60, nullable: false })
    token!: string; // 토큰 값

    @OneToOne(() => MemberEntity, (member) => member.refreshToken)
    member!: MemberEntity;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
