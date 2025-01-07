import { IsNotEmpty, IsNumber } from "class-validator";
import {
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";

@Unique(["blackerId", "blackedId"])
@Entity("black_list")
export class BlackListEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @PrimaryColumn({ type: "int" })
    @IsNumber()
    @IsNotEmpty()
    blackerId!: number;

    @PrimaryColumn({ type: "int" })
    @IsNumber()
    @IsNotEmpty()
    blackedId!: number;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;
}
