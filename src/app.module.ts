import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from './config/app-config.module';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './app/auth/auth.controller';
import { AuthService } from './app/auth/auth.service';
import { PrismaModule } from './app/prisma/prisma.module';
import { UserController } from './app/user/user.controller';
import { UserService } from './app/user/user.service';
import { ConfigService } from './app/config/config.service';
import { ThemeService } from './app/theme/theme.service';
import { ConfigController } from './app/config/config.controller';
import { ModuleController } from './app/module/module.controller';
import { ModuleService } from './app/module/module.service';
import { ClientUserController } from './app/client-user/client-user.controller';
import { TransferController } from './app/transfer/transfer.controller';
import { AuthMiddleware } from './middleware/auth';
import { LoggerMiddleware } from './middleware/logger';

@Module({
  imports: [HttpModule, AppConfigModule, PrismaModule],
  controllers: [
    AuthController,
    UserController,
    ConfigController,
    ModuleController,
    ClientUserController,
    TransferController,
  ],
  providers: [
    AuthService,
    UserService,
    ConfigService,
    ThemeService,
    ModuleService,
  ],
})
export class AppModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
