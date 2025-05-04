import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [PrismaModule],
  providers: [ConfigService],
})
export class UserModule {}
