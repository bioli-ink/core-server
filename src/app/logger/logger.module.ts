import { Module } from '@nestjs/common';
import { BambooLoggerService } from './logger.service';

@Module({
  providers: [BambooLoggerService],
  exports: [BambooLoggerService],
})
export class BambooLoggerModule {}
