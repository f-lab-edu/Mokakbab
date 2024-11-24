import {
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("block_list")
export class BlockListEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @PrimaryColumn({ type: "int" })
    blockerId!: number;

    @PrimaryColumn({ type: "int" })
    blockedId!: number;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;
}
