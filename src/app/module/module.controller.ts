import { Body, Controller, Get, Inject, Put } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AppConfigService } from 'src/config/app-config.service';
import { ModuleService } from './module.service';
import { UpdateModuleReq } from './module.dto';

@Controller('module')
export class ModuleController {
  public constructor(
    @Inject(REQUEST) private req: Request,
    private config: AppConfigService,
    private moduleService: ModuleService,
  ) {}

  @Put()
  public async update(@Body() params: UpdateModuleReq) {
    await this.moduleService.update(params);

    return;
  }

  @Get()
  public async query() {
    const userId = this.req.headers[this.config.getHeaderIdKey()];
    const result = await this.moduleService.query({ user_id: userId });

    return result;
  }
}
