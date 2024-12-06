import { BadRequestException, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import multer from "multer";
import { extname } from "path";

import { MAX_FILE_SIZE } from "@APP/common/constants/number.const";
import { MembersController } from "@APP/controllers/members.controller";
import { MemberEntity } from "@APP/entities/member.entity";
import { RefreshTokenEntity } from "@APP/entities/refresh-token.entity";
import { VerificationCodeEntity } from "@APP/entities/verification-code.entity";
import { MembersRepository } from "@APP/repositories/members.repository";
import { RefreshTokenRepository } from "@APP/repositories/refresh-token.repository";
import { VerificationCodeRepository } from "@APP/repositories/verification-code.repository";
import { MembersService } from "@APP/services/members.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MemberEntity,
            RefreshTokenEntity,
            VerificationCodeEntity,
        ]),
        MulterModule.register({
            limits: {
                fileSize: MAX_FILE_SIZE,
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
    providers: [
        MembersService,
        MembersRepository,
        RefreshTokenRepository,
        VerificationCodeRepository,
    ],
    exports: [MembersService],
})
export class MembersModule {}
