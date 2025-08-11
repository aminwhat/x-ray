import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'XRAY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URI ?? 'amqp://localhost:5672'],
          queue: 'x-ray-queue',
        },
      },
    ]),
  ],
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class ProcessModule {}
