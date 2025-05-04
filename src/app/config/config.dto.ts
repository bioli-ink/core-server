import { IsOptional, Length } from 'class-validator';

export class UpdateBaseConfigReq {
  @IsOptional()
  @Length(1, 50)
  name?: string;

  @IsOptional()
  type?: number;

  @IsOptional()
  @Length(1, 20)
  otherType?: string;

  @IsOptional()
  @Length(1, 100)
  avatar?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  platform?: string;
}
