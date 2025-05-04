import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigModule } from './config/app-config.module';
import { AppConfigService } from './config/app-config.service';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptor/response';
import { traceIdMiddleware } from './middleware/trace-id';
import { AuthMiddleware } from './middleware/auth';
import { KeyCaseTransformInterceptor } from './interceptor/key-case-transform';

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

  app.use(AuthMiddleware);
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
  const PORT = config.port();

  console.log(`app listen on ${PORT}`);

  await app.listen(PORT);
}
bootstrap();
