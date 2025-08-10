import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type XRayDocument = HydratedDocument<XRay>;

@Schema({ autoIndex: true })
export class XRay {}

export const XRaySchema = SchemaFactory.createForClass(XRay);
