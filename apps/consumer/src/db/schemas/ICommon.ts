import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export abstract class ICommon {
  @Prop({ default: Date.now, required: false, type: Date })
  createdDate: Date;
}
