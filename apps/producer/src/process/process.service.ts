import { Inject, Injectable } from '@nestjs/common';
import { FilterProcessDto, ProcessDataDetails, StartProcessDto } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { SharedLoggerService } from '@app/shared.logger';
import { CommonResponse } from '@app/shared.types';

@Injectable()
export class ProcessService {
  private readonly logger = new SharedLoggerService(ProcessService.name);

  constructor(@Inject('XRAY_SERVICE') private rabbitClient: ClientProxy) {}

  convertBodyToDto(body: any): CommonResponse<StartProcessDto[]> {
    try {
      const result: StartProcessDto[] = [];

      for (const deviceId in body) {
        if (!Object.prototype.hasOwnProperty.call(body, deviceId)) continue;

        const deviceData = body[deviceId];
        const { data, time: recordedDate } = deviceData;

        const details: ProcessDataDetails[] = data.map((entry: any[]) => {
          let time: number | undefined,
            latitude: number | undefined,
            longitude: number | undefined,
            speed: number | undefined;

          if (entry.length === 2) {
            [time, [latitude, longitude, speed]] = entry;
          } else {
            [latitude, longitude, speed] = entry[0];
          }

          return {
            time,
            latitude,
            longitude,
            speed,
          };
        });

        result.push({
          deviceId,
          details,
          RecordedDate: recordedDate,
        });
      }

      if (result.length === 0) {
        throw new Error('Body is Empty');
      }

      return {
        succeed: true,
        data: result,
        message: null,
      };
    } catch (error) {
      this.logger.error(error);

      return {
        succeed: false,
        data: null,
        message: 'Failed to convert body to DTO: ' + error.message,
      };
    }
  }

  startProcess(models: StartProcessDto[]): CommonResponse<string> {
    for (const md of models) {
      this.rabbitClient.emit('x-ray', md);
    }

    return {
      succeed: true,
      data: 'Process Started',
      message: null,
    };
  }

  async getData(model: FilterProcessDto): Promise<CommonResponse<string>> {
    let result: CommonResponse<any>;

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
