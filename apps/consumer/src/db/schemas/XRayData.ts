import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ICommon } from './ICommon';

export type XRayDocument = HydratedDocument<XRay>;

@Schema({ autoIndex: true })
export class XRay extends ICommon {
  @Prop({ required: true, index: true })
  deviceId: string;

  @Prop({ required: true, type: Number })
  time: number;

  @Prop({ required: true, type: Number })
  latitude: number; // x

  @Prop({ required: true, type: Number })
  longitude: number; // y

  @Prop({ required: true, type: Number })
  speed: number;

  @Prop({ required: true, index: true })
  RecordedDate: Date;
}

export const XRaySchema = SchemaFactory.createForClass(XRay);
