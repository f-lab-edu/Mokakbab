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
    REFRESH_TOKEN_NOT_FOUND: new ErrorCode(
        "2008",
        "Refresh 토큰이 존재하지 않습니다.",
    ),
};

export const ArticleErrorCode = {
    NOT_FOUND_CATEGORY: new ErrorCode("3001", "카테고리를 찾을 수 없습니다."),
    NOT_FOUND_REGION: new ErrorCode("3002", "지역을 찾을 수 없습니다."),
    NOT_FOUND_ARTICLE: new ErrorCode("3003", "게시글을 찾을 수 없습니다."),
    FORBIDDEN_ARTICLE: new ErrorCode("3004", "권한이 없습니다."),
};

export const ParticipationErrorCode = {
    ALREADY_PARTICIPATED: new ErrorCode("4001", "이미 참여한 게시글입니다."),
    NOT_FOUND_PARTICIPATION: new ErrorCode(
        "4002",
        "참여 정보를 찾을 수 없습니다.",
    ),
};
