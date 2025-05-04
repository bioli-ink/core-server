export enum HTTP_STATUS {
  LOGIN_EXPIRED = 40001,
  AUTH_FAIL = 40002,
}

export const HTTP_STATUS_TEXT: Record<HTTP_STATUS, string> = {
  [HTTP_STATUS.LOGIN_EXPIRED]: '登录态过期',
  [HTTP_STATUS.AUTH_FAIL]: '身份校验失败',
};
