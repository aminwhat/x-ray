import { Inject, Injectable } from '@nestjs/common';
import { StartProcessDto } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { SharedLoggerService } from '@app/shared.logger';
import { CommonResponse } from '@app/shared.types';

@Injectable()
export class ProcessService {
  private readonly logger = new SharedLoggerService(ProcessService.name);

  constructor(@Inject('XRAY_SERVICE') private rabbitClient: ClientProxy) {}

  startProcess(model: StartProcessDto): CommonResponse<string> {
    this.rabbitClient.emit('x-ray', model);

    return {
      succeed: true,
      data: 'Process Started',
      message: null,
    };
  }

  async getData(
    model: Partial<StartProcessDto>,
  ): Promise<CommonResponse<string>> {
    let result: CommonResponse<string>;

    try {
      const observed = this.rabbitClient
        .send({ cmd: 'x-ray-signal' }, model ?? {})
        .pipe(timeout(5000));

      result = await firstValueFrom(observed);
    } catch (error) {
      this.logger.error(error);

      result = {
        succeed: false,
        data: null,
        message: "Message Broker Couldn't Respond",
      };
    }

    return result;
  }
}
