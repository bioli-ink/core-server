import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserReq } from './user.dto';
import { irreversibilityEncryption } from 'src/utils/crypto';
import { REQUEST } from '@nestjs/core';
import { AppConfigService } from 'src/config/app-config.service';

@Controller('user')
export class UserController {
  public constructor(
    @Inject(REQUEST) private req: Request,
    private config: AppConfigService,
    private userService: UserService,
  ) {}

  @Put()
  public async updateUser(@Body() params: UpdateUserReq) {
    const id = this.req.headers[this.config.getHeaderIdKey()];
    const hasFound = await this.userService.query({ id });

    if (!hasFound || hasFound.id !== id) {
      throw new BadRequestException('用户不存在');
    }

    if (params.username) {
      const hasDuplicate = await this.userService.queryAll({
        username: params.username,
        NOT: [{ id }],
      });

      if (hasDuplicate.length) {
        throw new BadRequestException('用户名已存在');
      }
    }

    let pw = '';

    if (params.password) {
      pw = irreversibilityEncryption(params.password);
    }

    if (params.email) {
      // TODO 校验 email 的验证码
    }

    await this.userService.update(id, {
      ...params,
      ...(pw ? { password: pw } : {}),
    });

    return;
  }

  /**
   * 查用户的基础信息
   * 包括 user 表和 base_config 表里的内容
   * 因此没有直接用 @Get('/')
   */
  @Get('/base-info')
  public async getBaseInfo() {
    const result = await this.userService.getBaseInfo(
      this.req.headers[process.env.HEADER_ID_KEY],
    );

    return {
      id: result.id,
      mobile: result.mobile,
      username: result.username,
      name: result.base_config.name,
      avatar: result.base_config.avatar,
    };
  }
}
