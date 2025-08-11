import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { XRay } from './schemas';
import { Model } from 'mongoose';
import { FilterProcessDto, StartProcessDto } from '../dto';

@Injectable()
export class DbService {
  constructor(@InjectModel(XRay.name) private xRayModel: Model<XRay>) {}

  async insertXRayDataFromStartProcess(model: StartProcessDto) {
    for (const md of model.details) {
      const newModel = new this.xRayModel({
        deviceId: model.deviceId,
        RecordedDate: model.RecordedDate,
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
}
