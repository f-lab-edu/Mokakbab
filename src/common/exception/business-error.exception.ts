import { ErrorCode } from "./error-code";

export class BusinessErrorException extends Error {
    constructor(readonly errorCode: ErrorCode) {
        super(errorCode.message);
    }
}
