import { NestFactory } from '@nestjs/core';
import { ProducerModule } from './producer.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule);

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

  // Configure Dto
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
