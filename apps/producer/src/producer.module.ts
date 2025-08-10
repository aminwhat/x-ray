import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { ProcessModule } from './process/process.module';
import { SharedLoggerModule } from '@app/shared.logger';

@Module({
  imports: [ProcessModule, SharedLoggerModule],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}
