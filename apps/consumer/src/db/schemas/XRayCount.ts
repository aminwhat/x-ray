import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ICommon } from './ICommon';

export type XRayCountDocument = HydratedDocument<XRayCount>;

@Schema({ autoIndex: true })
export class XRayCount extends ICommon {
  @Prop({ required: true, index: true })
  deviceId: string;

  @Prop({ required: true })
  dataArrayCount: number;
}

export const XRayCountSchema = SchemaFactory.createForClass(XRayCount);
