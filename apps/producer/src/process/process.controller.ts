import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ProcessService } from './process.service';
import { FilterProcessDto } from './dto';
import type { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @ApiOperation({ summary: 'Process & Store Data' })
  @ApiBody({
    description:
      'JSON object where keys are device IDs, values are device data',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'array',
              items: [
                { type: 'number', description: 'time' },
                {
                  type: 'array',
                  items: [
                    { type: 'number', description: 'latitude' }, // index 0
                    { type: 'number', description: 'longitude' }, // index 1
                    { type: 'number', description: 'speed' }, // index 2
                  ],
                  minItems: 3,
                  maxItems: 3,
                },
              ],
            },
          } as any,
          time: {
            type: 'number',
            description: 'Recorded timestamp',
          },
        },
        required: ['data', 'time'],
      },
      example: {
        '66bb584d4ae73e488c30a072': {
          data: [
            [27729, [51.339602, 12.3390955, 2.531684]],
            [28729, [51.3396005, 12.33909717, 1.376036]],
          ],
          time: 1735683480000,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Process Started Successfully',
    content: {
      'application/json': {
        example: {
          succeed: true,
          data: 'Process Started',
          message: null,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Body Data Validation Failed - DTO Parser Failed',
    content: {
      'application/json': {
        example: {
          succeed: false,
          data: null,
          message: 'Failed to convert body to DTO',
        },
      },
    },
  })
  @Post('start')
  startProcess(@Req() req: Request, @Res() res: Response) {
    const validated = this.processService.convertBodyToDto(req.body);

    if (!validated.succeed) {
      res.status(400).send(validated);
      return;
    }

    const result = this.processService.startProcess(validated.data);

    if (!result.succeed) {
      res.status(400).send(result);
      return;
    }

    res.status(200).send(result);
  }

  @ApiOperation({ summary: 'Get Data By the Specified Values as the filter' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Process Started Successfully',
    content: {
      'application/json': {
        example: {
          succeed: true,
          data: [
            {
              _id: '6899a2a9aa9645706b4d6fd3',
              RecordedDate: '2024-12-31T22:18:00.000Z',
              deviceId: '66bb584d4ae73e488c30a072',
              time: 762,
              latitude: 51.339764,
              longitude: 12.339223833333334,
              speed: 1.2038000000000002,
              createdDate: '2025-08-11T07:58:33.580Z',
              __v: 0,
            },
            {
              _id: '6899a2a9aa9645706b4d6fd5',
              RecordedDate: '2024-12-31T22:18:00.000Z',
              deviceId: '66bb584d4ae73e488c30a072',
              time: 1766,
              latitude: 51.33977733333333,
              longitude: 12.339211833333334,
              speed: 1.531604,
              createdDate: '2025-08-11T07:58:33.588Z',
              __v: 0,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Couldn't Send Message to the Message Broker",
    content: {
      'application/json': {
        example: {
          succeed: false,
          data: null,
          message: "Message Broker Couldn't Respond",
        },
      },
    },
  })
  @Get(':deviceId')
  async getData(@Param() model: FilterProcessDto, @Res() res: Response) {
    const result = await this.processService.getData(model);

    if (!result.succeed) {
      res.status(400).send(result);
      return;
    }
    res.status(200).send(result);
  }
}
