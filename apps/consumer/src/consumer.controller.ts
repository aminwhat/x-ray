import { Controller } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { StartProcessDto } from './dto';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern('x-ray')
  async handleStartProcess(@Payload() model: StartProcessDto) {
    await this.consumerService.handleStartProcess(model);
  }

  @MessagePattern({ cmd: 'x-ray-signal' })
  async handleGetData(@Payload() model: Partial<StartProcessDto>) {
    return await this.consumerService.handleGetData(model);
  }
}
