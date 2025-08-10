import { NestFactory } from '@nestjs/core';
import { ProducerModule } from './producer.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SharedLoggerService } from '@app/shared.logger';
import morgan from 'morgan';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule);
  const logger = app.get<SharedLoggerService>(SharedLoggerService);

  app.useLogger(app.get(SharedLoggerService));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('X-Ray Project')
    .setDescription(
      'A sample of Collecting data from IOT devices and then pass it through microservices',
    )
    .setVersion('1.0')
    .addTag('x-ray')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cors());
  app.use(
    morgan('tiny', {
      stream: {
        write: (message: string) => {
          logger.log(message.trim(), 'Morgan');
        },
      },
    }),
  );

  // Configure Dto
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.port ?? 3000;

  await app.listen(port, () => {
    logger.log(
      `Server started on port ${port} as Date of: ${new Date(Date.now()).toISOString()}`,
      'BOOTSTRAP',
    );
  });
}
bootstrap();
