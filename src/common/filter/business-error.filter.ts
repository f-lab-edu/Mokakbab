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
            // 400 Bad Request
            case "2001":
            case "2007":
                status = 400;
                break;

            // 401 Unauthorized
            case "2003":
            case "2004":
            case "2005":
            case "2006":
                status = 401;
                break;

            // 403 Forbidden
            case "3004":
                status = 403;
                break;

            // 404 Not Found
            case "2002":
            case "3001":
            case "3002":
            case "3003":
                status = 404;
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
