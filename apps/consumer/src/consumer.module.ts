// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { DbModule } from './db/db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedLoggerModule } from '@app/shared.logger';

@Module({
  imports: [
    DbModule,
    SharedLoggerModule,
    // I could handle the possibility of the null of the arguments in a better way, but i just wanted to keep it simple
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost', {
      dbName: process.env.MONGO_DB ?? 'x-ray',
      user: process.env.MONGO_USERNAME ?? 'root',
      pass: process.env.MONGO_PASSWORD ?? 'my-secret-pw',
    }),
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}
