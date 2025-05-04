import * as OpenApi from '@alicloud/openapi-client';
import * as Dypnsapi20170525 from '@alicloud/dypnsapi20170525';
import * as Util from '@alicloud/tea-util';
import { HttpStatus } from '@nestjs/common';

/**
 * 使用AK&SK初始化账号Client
 */
function createClient() {
  const config = new OpenApi.Config({
    accessKeyId: process.env['ALIBABA_CLOUD_ACCESS_KEY_ID'],
    accessKeySecret: process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET'],
  });

  config.endpoint = 'dypnsapi.aliyuncs.com';

  return new Dypnsapi20170525.default(config);
}

export const sendVerifyCode = async (phone) => {
  const client = createClient();
  const sendSmsVerifyCodeRequest =
    new Dypnsapi20170525.SendSmsVerifyCodeRequest({
      signName: 'bioliink短信验证',
      templateCode: 'SMS_475760288',
      phoneNumber: phone,
      templateParam: '{"code":"##code##"}',
    });
  const runtime = new Util.RuntimeOptions({});
  try {
    const resp = await client.sendSmsVerifyCodeWithOptions(
      sendSmsVerifyCodeRequest,
      runtime,
    );

    if (
      resp.statusCode === HttpStatus.OK &&
      resp.body.code === HttpStatus[HttpStatus.OK]
    ) {
      return { status: true };
    }

    return { status: false, message: resp.body.message };
  } catch (error) {
    // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
    // 错误 message
    console.log(error.message);
    // 诊断地址
    console.log(error.data['Recommend']);
    Util.default.assertAsString(error.message);

    return { status: false, message: error.message };
  }
};

export const checkVerifyCode = async ({
  phone,
  verifyCode,
}: {
  phone: string;
  verifyCode: string;
}) => {
  const client = createClient();
  const checkSmsVerifyCodeRequest =
    new Dypnsapi20170525.CheckSmsVerifyCodeRequest({
      phoneNumber: phone,
      verifyCode,
    });
  const runtime = new Util.RuntimeOptions({});

  try {
    // 复制代码运行请自行打印 API 的返回值
    const resp = await client.checkSmsVerifyCodeWithOptions(
      checkSmsVerifyCodeRequest,
      runtime,
    );

    if (
      resp.statusCode === HttpStatus.OK &&
      resp.body.code === HttpStatus[HttpStatus.OK]
    ) {
      return { status: true };
    }

    return { status: false, message: resp.body.message };
  } catch (error) {
    // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
    // 错误 message
    console.log(error.message);
    // 诊断地址
    console.log(error.data['Recommend']);
    Util.default.assertAsString(error.message);

    return { status: false, message: error.message };
  }
};
