import {
  IsIn,
  IsNumberString,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class LoginReq {
  @IsOptional()
  @IsNumberString()
  @Matches(/^1[3-9]\d{9}$/)
  public mobile?: string;

  @IsOptional()
  @IsNumberString()
  @Length(4, 4)
  public verifyCode?: string;

  // 可以是用户名，也可以是 email
  @IsOptional()
  public username?: string;

  @IsOptional()
  public password?: string;
}

export class GetUploadTokenReq {
  @IsIn(['avatar', 'wechat', 'image'])
  public type: string;

  @IsOptional()
  public name?: string;
}

export class GetVerifyCodeReq {
  @IsNumberString()
  @Matches(/^1[3-9]\d{9}$/)
  public mobile: string;
}
