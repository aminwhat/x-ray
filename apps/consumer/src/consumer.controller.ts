import { Controller } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { StartProcessDto } from './dto';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern('x-ray')
  async handleStartProcess(@Payload() model: StartProcessDto) {
    await this.consumerService.handleStartProcess(model);
  }
}
