import { Injectable } from '@nestjs/common';
import { StartProcessDto } from './dto';
import { DbService } from './db/db.service';

@Injectable()
export class ConsumerService {
  constructor(private readonly dbService: DbService) {}

  async handleStartProcess(model: StartProcessDto) {
    await this.dbService.insertXRayDataFromStartProcess(model);
  }

  async handleGetData(model: Partial<StartProcessDto>) {
    return await this.dbService.getXRayByFilter(model);
  }
}
