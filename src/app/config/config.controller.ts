import { Body, Controller, Get, Inject, Put } from '@nestjs/common';
import { ConfigService } from './config.service';
// import { UpdateBaseConfigReq } from './config.dto';
import { REQUEST } from '@nestjs/core';
import { AppConfigService } from 'src/config/app-config.service';
import { UpdateBaseConfigReq } from './config.dto';
import { UserService } from '../user/user.service';

@Controller('config')
export class ConfigController {
  public constructor(
    @Inject(REQUEST) private req: Request,
    private config: AppConfigService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  // 查用户的全量配置
  @Get()
  public async query() {
    const id = this.req.headers[this.config.getHeaderIdKey()];
    const result = await this.userService.findAllInfo({ id });
    const { base_config, modules, theme, ...user } = result;

    delete result.base_config.create_time;
    delete result.base_config.update_time;
    delete result.modules.create_time;
    delete result.modules.update_time;

    result.theme.map((t) => {
      delete t.create_time;
      delete t.update_time;
    });

    return {
      id: user.id,
      username: user.username,
      mobile: user.mobile,
      baseConfig: base_config,
      modules,
      theme,
    };
  }

  // 更新用户的基础配置
  @Put()
  public async update(@Body() params: UpdateBaseConfigReq) {
    const id = this.req.headers[this.config.getHeaderIdKey()];

    await this.configService.update(id, params);

    return;
  }
}
