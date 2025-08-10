import { Body, Controller, Post, Res } from '@nestjs/common';
import { ProcessService } from './process.service';
import { StartProcessDto } from './dto';
import type { Response } from 'express';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post('start')
  startProcess(@Body() model: StartProcessDto, @Res() res: Response) {
    const result = this.processService.startProcess(model);

    if (!result.succeed) {
      res.status(400).send(result);
      return;
    }

    res.status(200).send(result);
  }

  @Post('get')
  async getData(@Body() model: Partial<StartProcessDto>, @Res() res: Response) {
    const result = await this.processService.getData(model);

    if (!result.succeed) {
      res.status(400).send(result);
      return;
    }
    res.status(200).send(result);
  }
}
