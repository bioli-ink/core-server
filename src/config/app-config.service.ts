import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  public constructor(private config: ConfigService) {}

  public isDev() {
    return process.env.NODE_ENV === 'development';
  }

  public isProd() {
    return process.env.NODE_ENV === 'production';
  }

  public isNotProd() {
    return process.env.NODE_ENV !== 'production';
  }

  public port() {
    return Number(this.config.get<string>('PORT'));
  }

  public getHeaderIdKey() {
    return this.config.get<string>('HEADER_ID_KEY');
  }

  public getLoginAuthKey() {
    return this.config.get<string>('LOGIN_AUTH_KEY');
  }

  public getQiniuAccessKey() {
    return this.config.get<string>('QINIU_ACCESS_KEY');
  }

  public getQiniuSecretKey() {
    return this.config.get<string>('QINIU_SECRET_KEY');
  }

  public getAvatarQiniuBucket() {
    return this.config.get<string>('AVATAR_QINIU_BUCKET');
  }

  public getDailyImageDomain() {
    return this.config.get<string>('DAILY_IMAGE_DOMAIN');
  }
}
