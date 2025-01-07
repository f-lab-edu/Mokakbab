import { IsNotEmpty, IsNumber } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";

import { ParticipationStatus } from "@APP/common/enum/participation-status.enum";

import { ArticleEntity } from "./article.entity";
import { MemberEntity } from "./member.entity";

@Unique(["articleId", "memberId"])
@Index(["status", "articleId"])
@Entity({ name: "participation" })
export class ParticipationEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @Column({ type: "int", nullable: false })
    memberId!: number;

    @IsNotEmpty()
    @IsNumber()
    @Column({ type: "int", nullable: false })
    articleId!: number;

    @ManyToOne(() => ArticleEntity, (article) => article.participations)
    @JoinColumn({ name: "articleId", referencedColumnName: "id" })
    article!: ArticleEntity;

    @ManyToOne(() => MemberEntity, (member) => member.participations)
    @JoinColumn({ name: "memberId", referencedColumnName: "id" })
    member!: MemberEntity;

    @Column({
        type: "enum",
        enum: ParticipationStatus,
        default: ParticipationStatus.ACTIVE,
    })
    status!: ParticipationStatus;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;
}
