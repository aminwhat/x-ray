import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type XRayDocument = HydratedDocument<XRay>;

@Schema()
export class XRay {}

export const XRaySchema = SchemaFactory.createForClass(XRay);
