import { Test, TestingModule } from '@nestjs/testing';
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { Request, Response } from 'express';

describe('ProcessController', () => {
  let controller: ProcessController;
  let mockProcessService: jest.Mocked<ProcessService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const mockService = {
      convertBodyToDto: jest.fn(),
      startProcess: jest.fn(),
      getData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessController],
      providers: [
        {
          provide: ProcessService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProcessController>(ProcessController);
    mockProcessService = module.get(ProcessService);

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('startProcess', () => {
    it('should process valid request successfully', () => {
      const validBody = {
        '66bb584d4ae73e488c30a072': {
          data: [[27729, [51.339602, 12.3390955, 2.531684]]],
          time: 1735683480000,
        },
      };

      const convertedDto = {
        succeed: true,
        data: [
          {
            deviceId: '66bb584d4ae73e488c30a072',
            details: [
              {
                time: 27729,
                latitude: 51.339602,
                longitude: 12.3390955,
                speed: 2.531684,
              },
            ],
            RecordedDate: 1735683480000,
          },
        ],
        message: null,
      };

      const processResult = {
        succeed: true,
        data: 'Process Started',
        message: null,
      };

      mockRequest.body = validBody;
      mockProcessService.convertBodyToDto.mockReturnValue(convertedDto);
      mockProcessService.startProcess.mockReturnValue(processResult);

      controller.startProcess(mockRequest as Request, mockResponse as Response);

      expect(mockProcessService.convertBodyToDto).toHaveBeenCalledWith(
        validBody,
      );
      expect(mockProcessService.startProcess).toHaveBeenCalledWith(
        convertedDto.data,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(processResult);
    });

    it('should handle DTO conversion failure', () => {
      const invalidBody = {};
      const conversionError = {
        succeed: false,
        data: null,
        message: 'Failed to convert body to DTO',
      };

      mockRequest.body = invalidBody;
      mockProcessService.convertBodyToDto.mockReturnValue(conversionError);

      controller.startProcess(mockRequest as Request, mockResponse as Response);

      expect(mockProcessService.convertBodyToDto).toHaveBeenCalledWith(
        invalidBody,
      );
      expect(mockProcessService.startProcess).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(conversionError);
    });

    it('should handle process service failure', () => {
      const validBody = {
        device1: {
          data: [[27729, [51.339602, 12.3390955, 2.531684]]],
          time: 1735683480000,
        },
      };

      const convertedDto = {
        succeed: true,
        data: [
          {
            deviceId: 'device1',
            details: [
              {
                time: 27729,
                latitude: 51.339602,
                longitude: 12.3390955,
                speed: 2.531684,
              },
            ],
            RecordedDate: 1735683480000,
          },
        ],
        message: null,
      };

      const processError = {
        succeed: false,
        data: null,
        message: 'RabbitMQ connection failed',
      };

      mockRequest.body = validBody;
      mockProcessService.convertBodyToDto.mockReturnValue(convertedDto);
      mockProcessService.startProcess.mockReturnValue(processError);

      controller.startProcess(mockRequest as Request, mockResponse as Response);

      expect(mockProcessService.convertBodyToDto).toHaveBeenCalledWith(
        validBody,
      );
      expect(mockProcessService.startProcess).toHaveBeenCalledWith(
        convertedDto.data,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(processError);
    });

    it('should handle malformed request body', () => {
      const malformedBody = 'invalid json';
      const conversionError = {
        succeed: false,
        data: null,
        message:
          'Failed to convert body to DTO: Cannot read properties of undefined',
      };

      mockRequest.body = malformedBody;
      mockProcessService.convertBodyToDto.mockReturnValue(conversionError);

      controller.startProcess(mockRequest as Request, mockResponse as Response);

      expect(mockProcessService.convertBodyToDto).toHaveBeenCalledWith(
        malformedBody,
      );
      expect(mockProcessService.startProcess).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(conversionError);
    });
  });

  describe('getData', () => {
    it('should return data successfully', async () => {
      const filterDto = { deviceId: 'device123' };
      const successResponse = {
        succeed: true,
        data: [
          {
            _id: '6899a2a9aa9645706b4d6fd3',
            RecordedDate: '2024-12-31T22:18:00.000Z',
            deviceId: 'device123',
            time: 762,
            latitude: 51.339764,
            longitude: 12.339223833333334,
            speed: 1.2038000000000002,
            createdDate: '2025-08-11T07:58:33.580Z',
            __v: 0,
          },
        ],
        message: null,
      };

      mockProcessService.getData.mockResolvedValue(successResponse);

      await controller.getData(filterDto, mockResponse as Response);

      expect(mockProcessService.getData).toHaveBeenCalledWith(filterDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(successResponse);
    });

    it('should handle service error response', async () => {
      const filterDto = { deviceId: 'device123' };
      const errorResponse = {
        succeed: false,
        data: null,
        message: "Message Broker Couldn't Respond",
      };

      mockProcessService.getData.mockResolvedValue(errorResponse);

      await controller.getData(filterDto, mockResponse as Response);

      expect(mockProcessService.getData).toHaveBeenCalledWith(filterDto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(errorResponse);
    });

    it('should handle service timeout', async () => {
      const filterDto = { deviceId: 'device123' };
      const timeoutResponse = {
        succeed: false,
        data: null,
        message: "Message Broker Couldn't Respond",
      };

      mockProcessService.getData.mockResolvedValue(timeoutResponse);

      await controller.getData(filterDto, mockResponse as Response);

      expect(mockProcessService.getData).toHaveBeenCalledWith(filterDto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(timeoutResponse);
    });

    it('should handle empty deviceId', async () => {
      const filterDto = { deviceId: '' };
      const emptyResponse = {
        succeed: true,
        data: [],
        message: null,
      };

      mockProcessService.getData.mockResolvedValue(emptyResponse);

      await controller.getData(filterDto, mockResponse as Response);

      expect(mockProcessService.getData).toHaveBeenCalledWith(filterDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(emptyResponse);
    });

    it('should handle service throwing exception', async () => {
      const filterDto = { deviceId: 'device123' };
      const errorResponse = {
        succeed: false,
        data: null,
        message: "Message Broker Couldn't Respond",
      };

      mockProcessService.getData.mockResolvedValue(errorResponse);

      await controller.getData(filterDto, mockResponse as Response);

      expect(mockProcessService.getData).toHaveBeenCalledWith(filterDto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(errorResponse);
    });

    it('should handle null filter parameter', async () => {
      const successResponse = {
        succeed: true,
        data: [],
        message: null,
      };

      mockProcessService.getData.mockResolvedValue(successResponse);

      await controller.getData(null, mockResponse as Response);

      expect(mockProcessService.getData).toHaveBeenCalledWith(null);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(successResponse);
    });
  });
});
