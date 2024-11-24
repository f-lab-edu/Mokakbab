import { BadRequestException, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import multer from "multer";
import { extname } from "path";

import { MembersController } from "@APP/controllers/members.controller";
import { BlockListEntity } from "@APP/entities/block-list.entity";
import { MemberEntity } from "@APP/entities/member.entity";
import { BlockListRepository } from "@APP/repositories/block-list.repository";
import { MembersRepository } from "@APP/repositories/members.repository";
import { MembersService } from "@APP/services/members.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([MemberEntity, BlockListEntity]),
        MulterModule.register({
            limits: {
                fileSize: 10000000,
            },
            fileFilter: (_req, file, cb) => {
                const ext = extname(file.originalname);
                if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
                    return cb(
                        new BadRequestException(
                            "jpg/jpeg/png 파일만 업로드 가능합니다",
                        ),
                        false,
                    );
                }

                return cb(null, true);
            },

            storage: multer.diskStorage({
                destination: function (_req, _file, cb) {
                    cb(null, "uploads/");
                },
                filename: function (_req, file, cb) {
                    cb(null, `${Date.now()}-${file.originalname}`);
                },
            }),
        }),
    ],
    controllers: [MembersController],
    providers: [MembersService, MembersRepository, BlockListRepository],
    exports: [MembersService],
})
export class MembersModule {}
