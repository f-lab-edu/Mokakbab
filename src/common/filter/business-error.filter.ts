import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

import { BusinessErrorException } from "../exception/business-error.exception";

@Catch(BusinessErrorException)
export class BusinessErrorFilter implements ExceptionFilter {
    catch(exception: BusinessErrorException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = 500;

        switch (exception.errorCode.code) {
            case "2001":
                status = 400;
                break;
            case "2004":
            case "2003":
                status = 401;
                break;
            case "2002":
                status = 404;
                break;
            case "2005":
                status = 401;
                break;
            case "2006":
                status = 401;
                break;
            case "2007":
                status = 400;
                break;
        }

        response.status(status).json({
            statusCode: status || 500,
            message:
                exception.errorCode.message ||
                "알 수 없는 에러가 발생했습니다.",
            error: exception.errorCode.code || "9999",
        });
    }
}
