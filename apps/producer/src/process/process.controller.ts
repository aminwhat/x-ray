import { Body, Controller, Post } from '@nestjs/common';
import { ProcessService } from './process.service';
import { StartProcessDto } from './dto';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post('start')
  startProcess(@Body() model: StartProcessDto) {
    return this.processService.startProcess(model);
  }

  @Post('startAndGetAnswer')
  async startProcessAndGetData(@Body() model: StartProcessDto) {
    return await this.processService.startProcessAndGetData(model);
  }
}
