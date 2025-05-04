import { IsEmail, IsOptional, Length, Matches } from 'class-validator';

export class UpdateUserReq {
  @IsOptional()
  @Length(4, 50)
  @Matches(/^[a-z][a-z0-9-_]{3,}$/)
  public username?: string;

  @IsOptional()
  @Length(8)
  public password?: string;

  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @Length(4)
  public emailVerifyCode?: string;
}
