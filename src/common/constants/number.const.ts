/**
 * bcrypt 해시 결과는 항상 60자 길이의 문자열입니다.
 * 참고: https://www.npmjs.com/package/bcrypt#hash-info
 */
export const PASSWORD_HASH_LENGTH = 60;

/**
 * bcrypt 해시 결과는 항상 60자 길이의 문자열입니다.
 * 참고: https://www.npmjs.com/package/bcrypt#hash-info
 */
export const REFRESH_TOKEN_HASH_LENGTH = 60;

/**
 * 파일 최대 크기
 * 10MB
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
