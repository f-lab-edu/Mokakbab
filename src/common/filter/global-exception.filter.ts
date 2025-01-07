import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException ? exception.getStatus() : 500;

        this.logger.error(
            `Exception: ${exception instanceof Error ? exception.message : "Unknown error"}`,
            exception instanceof Error ? exception.stack : "",
        );

        response.status(status).json({
            statusCode: status,
            message:
                exception instanceof Error
                    ? exception.message
                    : "Internal Server Error",
        });
    }
}
