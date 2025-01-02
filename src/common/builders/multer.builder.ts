import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterModuleOptions } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import { extname } from "path";

import {
    ENV_N_ACCESS_KEY,
    ENV_N_BUCKET_NAME,
    ENV_N_ENDPOINT,
    ENV_N_REGION,
    ENV_N_SECRET_KEY,
} from "../constants/env-keys.const";
import { MAX_FILE_SIZE } from "../constants/number.const";

@Injectable()
export class MulterBuilder {
    private readonly s3: AWS.S3;
    private readonly bucketName: string;

    private options: Partial<MulterModuleOptions>;
    private resource = "";
    private path = "";

    constructor(private readonly configService: ConfigService) {
        this.options = {
            limits: {
                fileSize: MAX_FILE_SIZE,
            },
            fileFilter: this.defaultFileFilter,
        };

        this.s3 = new AWS.S3({
            endpoint:
                this.configService.get<string>(ENV_N_ENDPOINT) || "Endpoint",
            region: this.configService.get<string>(ENV_N_REGION) || "Region",
            credentials: {
                accessKeyId:
                    this.configService.get<string>(ENV_N_ACCESS_KEY) ||
                    "AccessKey",
                secretAccessKey:
                    this.configService.get<string>(ENV_N_SECRET_KEY) ||
                    "SecretKey",
            },
        });

        this.bucketName =
            this.configService.get<string>(ENV_N_BUCKET_NAME) || "BucketName";
    }

    private defaultFileFilter: MulterOptions["fileFilter"] = (
        _req,
        file,
        cb,
    ) => {
        const ext = extname(file.originalname);
        if (![".jpg", ".jpeg", ".png"].includes(ext)) {
            return cb(
                new BadRequestException(
                    "jpg/jpeg/png 파일만 업로드 가능합니다",
                ),
                false,
            );
        }
        return cb(null, true);
    };

    setResource(resource: string): this {
        this.resource = resource;
        return this;
    }

    setPath(path: string): this {
        this.path = path;
        return this;
    }

    setOverrideLimit(limit: Pick<MulterOptions, "limits">): this {
        this.options.limits = {
            ...this.options.limits,
            ...limit.limits,
        };
        return this;
    }

    setFileFilter(filter: Pick<MulterOptions, "fileFilter">): this {
        this.options.fileFilter = filter.fileFilter;
        return this;
    }

    setOptions(options: Partial<MulterOptions>): this {
        this.options = {
            ...this.options,
            ...options,
        };
        return this;
    }

    build(): MulterModuleOptions {
        return {
            ...this.options,
            storage: multerS3({
                s3: this.s3,
                bucket: this.bucketName,
                acl: "public-read",
                contentType: multerS3.AUTO_CONTENT_TYPE,
                key: (_req, file, cb) => {
                    const splitedFileNames = file.originalname.split(".");
                    const extension = splitedFileNames.at(
                        splitedFileNames.length - 1,
                    );

                    const env =
                        this.configService.get<string>("NODE_ENV") || "default";

                    const filename = this.path
                        ? `${env}${this.path}/${new Date().getTime()}.${extension}`
                        : `${env}${new Date().getTime()}.${extension}`;

                    cb(null, encodeURI(`${this.resource}/${filename}`));
                },
            }),
        };
    }
}
