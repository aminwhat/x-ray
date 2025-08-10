import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { ProcessModule } from './process/process.module';

@Module({
  imports: [ProcessModule],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}
