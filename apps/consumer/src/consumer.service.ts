import { Injectable } from '@nestjs/common';
import { FilterProcessDto, StartProcessDto } from './dto';
import { DbService } from './db/db.service';
import { CommonResponse } from '@app/shared.types';
import { XRay } from './db/schemas';

@Injectable()
export class ConsumerService {
  constructor(private readonly dbService: DbService) {}

  async handleStartProcess(model: StartProcessDto) {
    await this.dbService.insertXRayDataFromStartProcess(model);
  }

  async handleGetData(
    model: FilterProcessDto,
  ): Promise<CommonResponse<XRay[]>> {
    const filterResult = await this.dbService.getXRayByFilter(model);

    return {
      succeed: true,
      data: filterResult,
      message: null,
    };
  }
}
