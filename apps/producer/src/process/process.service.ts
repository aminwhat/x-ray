import { Inject, Injectable } from '@nestjs/common';
import { StartProcessDto } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { SharedLoggerService } from '@app/shared.logger';

@Injectable()
export class ProcessService {
  private readonly logger = new SharedLoggerService(ProcessService.name);

  constructor(@Inject('XRAY_SERVICE') private rabbitClient: ClientProxy) {}

  startProcess(model: StartProcessDto) {
    this.rabbitClient.emit('x-ray', model);

    return {
      succeed: true,
      message: 'Process started',
      data: null,
    };
  }

  startProcessAndGetData(model: StartProcessDto): any {
    let result: any;

    try {
      result = this.rabbitClient.send('x-ray', model).pipe(timeout(5000));
    } catch (error) {
      this.logger.error(error);

      result = {
        succeed: false,
        message: "Couldn't get response from the message broker",
        data: JSON.stringify(error),
      };
    }

    return result;
  }
}
