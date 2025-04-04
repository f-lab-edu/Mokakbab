import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { REFRESH_TOKEN_HASH_LENGTH } from "@APP/common/constants/number.const";

import { MemberEntity } from "./member.entity";

@Entity("refresh_token")
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "varchar",
        length: REFRESH_TOKEN_HASH_LENGTH,
        nullable: true,
    })
    token!: string | null; // 토큰 값

    @OneToOne(() => MemberEntity, (member) => member.refreshToken)
    member!: MemberEntity;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
