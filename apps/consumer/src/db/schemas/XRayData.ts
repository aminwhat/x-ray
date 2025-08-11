import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ICommon } from './ICommon';

export type XRayDocument = HydratedDocument<XRay>;

@Schema({ autoIndex: true })
export class XRay extends ICommon {
  @Prop({ required: true, index: true })
  deviceId: string;

  @Prop({ required: false, type: Number })
  time?: number;

  @Prop({ required: false, type: Number })
  latitude?: number; // x

  @Prop({ required: false, type: Number })
  longitude?: number; // y

  @Prop({ required: false, type: Number })
  speed?: number;
}

export const XRaySchema = SchemaFactory.createForClass(XRay);
