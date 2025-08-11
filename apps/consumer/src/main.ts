import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './consumer.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SharedLoggerService } from '@app/shared.logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConsumerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_MQ_URI ?? 'amqp://localhost:5672'],
        queue: 'x-ray-queue',
      },
    },
  );

  const logger = app.get<SharedLoggerService>(SharedLoggerService);

  app.useLogger(app.get(SharedLoggerService));

  app.listen().then(() => {
    logger.log(
      `Server started as Date of: ${new Date(Date.now()).toISOString()}`,
      'BOOTSTRAP',
    );
  });
}
bootstrap();
