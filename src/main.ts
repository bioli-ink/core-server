import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigModule } from './config/app-config.module';
import { AppConfigService } from './config/app-config.service';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptor/response';
import { traceIdMiddleware } from './middleware/trace-id';
import { KeyCaseTransformInterceptor } from './interceptor/key-case-transform';
import { createDocs } from './utils/swagger-doc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? ['http://127.0.0.1:3000', 'http://localhost:3000']
        : 'https://www.bioli.ink',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // 允许携带凭证（包括Cookies）
  });

  app.use(traceIdMiddleware);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new KeyCaseTransformInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = app.select(AppConfigModule).get(AppConfigService);

  // 正式环境不生成接口文档
  if (config.isNotProd()) {
    await createDocs(app);
  }

  const PORT = config.port();

  console.log(`app listen on ${PORT}`);

  await app.listen(PORT);
}
bootstrap();
