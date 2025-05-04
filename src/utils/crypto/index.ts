import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';
import { MS_OF_WEEK } from 'src/constant/time';

const baseEncryption = (content: string) => {
  return createHash('md5').update(content).digest('hex');
};

/**
 * 不可逆的加密方法，使用 MD5 加密，默认加密三次
 * @param {String} content - 需要加密的内容
 * @param {Number} times - 需要加密的次数
 */
export const irreversibilityEncryption = (content: string, times = 3) => {
  const encrypt = baseEncryption(content);

  if (times <= 1) return encrypt;

  return irreversibilityEncryption(encrypt, times - 1);
};

export const getLoginCookie = ({ userId, username }) => {
  const iat = Date.now();

  // 生成新 token
  const token = sign(
    { sub: userId, name: username, iat },
    process.env.LOGIN_AUTH_KEY,
    {
      expiresIn: MS_OF_WEEK,
    },
  );

  return token;
};
