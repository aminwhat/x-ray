import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { XRay, XRayCount } from './schemas';
import { Model } from 'mongoose';
import { FilterProcessDto, StartProcessDto } from '../dto';

@Injectable()
export class DbService {
  constructor(
    @InjectModel(XRay.name) private xRayModel: Model<XRay>,
    @InjectModel(XRayCount.name) private xRayCountModel: Model<XRayCount>,
  ) {}

  async insertXRayDataFromStartProcess(model: StartProcessDto) {
    for (const md of model.details) {
      const newModel = new this.xRayModel({
        deviceId: model.deviceId,
        RecordedDate: new Date(model.RecordedDate),
        latitude: md.latitude,
        longitude: md.longitude,
        speed: md.speed,
        time: md.time,
      });
      await newModel.save();
    }
  }

  async getXRayByFilter(filter: FilterProcessDto) {
    return await this.xRayModel.find({ deviceId: filter.deviceId }).exec();
  }

  async insertXRayCount(model: XRayCount) {
    const newModel = new this.xRayCountModel(model);

    await newModel.save();
  }
}
