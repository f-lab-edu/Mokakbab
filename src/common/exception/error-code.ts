export class ErrorCode {
    constructor(
        readonly code: string,
        readonly message: string,
    ) {}
}

export const MemberErrorCode = {
    EMAIL_ALREADY_EXISTS: new ErrorCode("2001", "이미 가입한 이메일입니다"),
    NOT_FOUND_MEMBER: new ErrorCode("2002", "존재 하지 않는 사용자입니다."),
    INVALID_PASSWORD: new ErrorCode("2003", "비밀번호가 틀렸습니다."),
    INVALID_TOKEN: new ErrorCode("2004", "잘못된 토큰입니다"),
    TOKEN_NOT_FOUND: new ErrorCode("2005", "토큰이 없습니다!"),
    INVALID_TOKEN_TYPE: new ErrorCode(
        "2006",
        "토큰 재발급은 Refresh 토큰으로만 가능합니다!",
    ),
    INVALID_VERIFICATION_CODE: new ErrorCode(
        "2007",
        "인증 코드가 일치하지 않습니다",
    ),
};
