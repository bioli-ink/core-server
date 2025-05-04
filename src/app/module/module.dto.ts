import { IsString, Length } from 'class-validator';
import { MODULE_ID_LENGTH } from './config';

export class UpdateModuleReq {
  @IsString()
  @Length(MODULE_ID_LENGTH, MODULE_ID_LENGTH)
  id: string;

  @IsString()
  json: string;
}
