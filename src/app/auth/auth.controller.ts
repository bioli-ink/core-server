import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUploadTokenReq, GetVerifyCodeReq, LoginReq } from './auth.dto';
import { nanoid } from 'nanoid';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';
import { ThemeService } from '../theme/theme.service';
import { getLoginCookie, irreversibilityEncryption } from 'src/utils/crypto';
// import { MS_OF_WEEK } from 'src/constant/time';
import validator from 'validator';
import * as qiniu from 'qiniu';
import { AppConfigService } from 'src/config/app-config.service';
import { checkVerifyCode, sendVerifyCode } from 'src/utils/code/verify';
import { ModuleService } from '../module/module.service';

@Controller('auth')
export class AuthController {
  public constructor(
    private authService: AuthService,
    private config: AppConfigService,
    private userService: UserService,
    private configService: ConfigService,
    private moduleService: ModuleService,
    private themeService: ThemeService,
  ) {}

  private async register(mobile: string) {
    const { id } = await this.authService.register({
      id: nanoid(8),
      mobile: mobile,
      // TODO 暂时只支持国内手机号
      imsi: '86',
    });

    // 注册成功后将基础内容创建记录
    await this.configService.create({ user_id: id });
    await this.moduleService.create({ user_id: id });
    await this.themeService.create({ author_id: id });

    return { id };
  }

  @Post('/login')
  public async login(@Body() params: LoginReq) {
    const { mobile, username, password } = params;

    if (!mobile && (!username || !password)) {
      throw new BadRequestException('参数校验失败');
    }

    let foundUser;

    if (mobile) {
      // 先校验验证码
      if (!this.config.isDev()) {
        const checkResult = await checkVerifyCode({
          phone: params.mobile,
          verifyCode: params.verifyCode,
        });

        if (!checkResult.status) {
          throw new BadRequestException(
            checkResult.message || HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
          );
        }
      }

      foundUser = await this.userService.query({ mobile });

      // 用手机号找不到用户就直接注册
      if (!foundUser) {
        foundUser = await this.register(mobile);
      }
    } else if (username && password) {
      const isEmail = validator.isEmail(username);
      const fieldUsername = isEmail ? { email: username } : { username };

      foundUser = await this.userService.query({
        ...fieldUsername,
        password: irreversibilityEncryption(password),
      });

      if (!foundUser) {
        throw new BadRequestException(
          isEmail ? '邮箱校验' : '用户名或密码错误',
        );
      }
    } else {
      throw new BadRequestException('参数错误，请重试');
    }

    const token = getLoginCookie({
      userId: foundUser.id,
      // mobile 字段是一定存在的，用 username 这个 key 是为了更通用
      username: mobile,
    });

    // res.cookie('token', token, {
    //   maxAge: MS_OF_WEEK,
    //   path: '/',
    // });

    // res.send(HttpStatus[HttpStatus.OK]);
    return { token };
  }

  @Post('/logout')
  public async logout(@Response() res) {
    res.cookie('token', '');
    res.send(HttpStatus[HttpStatus.OK]);
  }

  @Get('/upload-token')
  public async uploadToken(@Query() query: GetUploadTokenReq) {
    let token = '';
    let key = '';

    const mac = new qiniu.auth.digest.Mac(
      this.config.getQiniuAccessKey(),
      this.config.getQiniuSecretKey(),
    );
    const fileName = irreversibilityEncryption(query.name || '');
    const putPolicy = new qiniu.rs.PutPolicy({
      // 允许覆盖上传 https://developer.qiniu.com/kodo/1206/put-policy
      scope: `${this.config.getAvatarQiniuBucket()}:${fileName}`,
    });

    token = putPolicy.uploadToken(mac);
    key = `${query.type}/${fileName}`;

    return { token, key };
  }

  @Get('/verify-code')
  public async getVerifyCode(@Query() query: GetVerifyCodeReq) {
    if (this.config.isDev()) return {};

    const result = await sendVerifyCode(query.mobile);

    if (result.status) {
      return {};
    }

    throw new BadRequestException(
      result.message || HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
    );
  }

  @Get('/login-status')
  public async getLoginStatus() {
    return true;
  }
}
