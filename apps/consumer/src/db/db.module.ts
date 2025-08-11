import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { XRay, XRayCount, XRayCountSchema, XRaySchema } from './schemas';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: XRay.name, schema: XRaySchema },
      { name: XRayCount.name, schema: XRayCountSchema },
    ]),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
