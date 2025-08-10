import { Module } from '@nestjs/common';
import { SharedLoggerService } from './shared.logger.service';

@Module({
  providers: [SharedLoggerService],
  exports: [SharedLoggerService],
})
export class SharedLoggerModule {}
