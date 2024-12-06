import {
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("black_list")
export class BlackListEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @PrimaryColumn({ type: "int" })
    blackerId!: number;

    @PrimaryColumn({ type: "int" })
    blackedId!: number;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;
}
