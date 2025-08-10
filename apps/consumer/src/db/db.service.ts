import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { XRay } from './schemas';
import { Model } from 'mongoose';
import { StartProcessDto } from '../dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DbService {
  constructor(@InjectModel(XRay.name) private xRayModel: Model<XRay>) {}

  async insertXRayDataFromStartProcess(model: StartProcessDto) {
    const parsedModel = plainToInstance(XRay, model);
    const newModel = new this.xRayModel(parsedModel);
    await newModel.save();
  }

  async getXRayByFilter(filter: Partial<StartProcessDto>) {
    return await this.xRayModel.find(filter).exec();
  }
}
