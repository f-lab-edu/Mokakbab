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
    id!: number; // 사용자아이디 (PK)

    @Column({ type: "varchar", length: 20, nullable: false })
    name!: string; // 사용자이름

    @Column({ type: "varchar", length: 40, nullable: false })
    nickname!: string; // 사용자별칭

    @Column({ type: "varchar", length: 60, nullable: false })
    password!: string; // 비밀번호

    @Column({ type: "varchar", length: 2048, nullable: true })
    profileImage?: string; // 프로필이미지

    @Column({ type: "varchar", length: 60, nullable: true })
    refreshToken?: string; // 리프레시토큰

    @Column({ type: "varchar", length: 60, nullable: true })
    verificationCode?: string; // 이메일인증코드

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date; // 생성날짜

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date; // 수정날짜
}
