import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { StartProcessDto, FilterProcessDto, ProcessDataDetails } from './dto';

describe('ConsumerController', () => {
  let controller: ConsumerController;
  let mockConsumerService: jest.Mocked<ConsumerService>;

  beforeEach(async () => {
    const mockService = {
      handleStartProcess: jest.fn(),
      handleGetData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumerController],
      providers: [
        {
          provide: ConsumerService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ConsumerController>(ConsumerController);
    mockConsumerService = module.get(ConsumerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleStartProcess', () => {
    it('should process valid StartProcessDto successfully', async () => {
      const validModel: StartProcessDto = {
        deviceId: '66bb584d4ae73e488c30a072',
        RecordedDate: 1735683480000,
        details: [
          {
            time: 27729,
            latitude: 51.339602,
            longitude: 12.3390955,
            speed: 2.531684,
          },
          {
            time: 28729,
            latitude: 51.3396005,
            longitude: 12.33909717,
            speed: 1.376036,
          },
        ],
      };

      mockConsumerService.handleStartProcess.mockResolvedValue(undefined);

      await controller.handleStartProcess(validModel);

      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        validModel,
      );
      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledTimes(1);
    });

    it('should handle single detail item', async () => {
      const singleDetailModel: StartProcessDto = {
        deviceId: 'single-device-123',
        RecordedDate: 1735683480000,
        details: [
          {
            time: 27729,
            latitude: 51.339602,
            longitude: 12.3390955,
            speed: 2.531684,
          },
        ],
      };

      mockConsumerService.handleStartProcess.mockResolvedValue(undefined);

      await controller.handleStartProcess(singleDetailModel);

      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        singleDetailModel,
      );
      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledTimes(1);
    });

    it('should handle empty details array', async () => {
      const emptyDetailsModel: StartProcessDto = {
        deviceId: 'empty-device-123',
        RecordedDate: 1735683480000,
        details: [],
      };

      mockConsumerService.handleStartProcess.mockResolvedValue(undefined);

      await controller.handleStartProcess(emptyDetailsModel);

      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        emptyDetailsModel,
      );
      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledTimes(1);
    });

    it('should handle partial detail data', async () => {
      const partialDetailsModel: StartProcessDto = {
        deviceId: 'partial-device-123',
        RecordedDate: 1735683480000,
        details: [
          {
            time: 27729,
            latitude: 51.339602,
            // longitude and speed are undefined
          },
          {
            latitude: 51.3396005,
            longitude: 12.33909717,
            // time and speed are undefined
          },
        ],
      };

      mockConsumerService.handleStartProcess.mockResolvedValue(undefined);

      await controller.handleStartProcess(partialDetailsModel);

      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        partialDetailsModel,
      );
      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledTimes(1);
    });

    it('should handle large dataset', async () => {
      const largeDataset: ProcessDataDetails[] = Array.from(
        { length: 1000 },
        (_, index) => ({
          time: index * 1000,
          latitude: 51.339602 + index * 0.0001,
          longitude: 12.3390955 + index * 0.0001,
          speed: Math.random() * 50,
        }),
      );

      const largeModel: StartProcessDto = {
        deviceId: 'bulk-device-123',
        RecordedDate: 1735683480000,
        details: largeDataset,
      };

      mockConsumerService.handleStartProcess.mockResolvedValue(undefined);

      await controller.handleStartProcess(largeModel);

      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        largeModel,
      );
      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledTimes(1);
    });

    it('should propagate service errors', async () => {
      const validModel: StartProcessDto = {
        deviceId: 'error-device-123',
        RecordedDate: 1735683480000,
        details: [
          {
            time: 27729,
            latitude: 51.339602,
            longitude: 12.3390955,
            speed: 2.531684,
          },
        ],
      };

      const serviceError = new Error('Database connection failed');
      mockConsumerService.handleStartProcess.mockRejectedValue(serviceError);

      await expect(controller.handleStartProcess(validModel)).rejects.toThrow(
        'Database connection failed',
      );

      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        validModel,
      );
      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledTimes(1);
    });

    it('should handle realistic GPS tracking scenario', async () => {
      const gpsTrackingModel: StartProcessDto = {
        deviceId: 'GPS_TRACKER_001',
        RecordedDate: 1640995200000,
        details: [
          { time: 0, latitude: 40.758, longitude: -73.9855, speed: 0 }, // Times Square start
          { time: 60, latitude: 40.7579, longitude: -73.9856, speed: 5.5 }, // Moving
          { time: 120, latitude: 40.7578, longitude: -73.9857, speed: 12.3 }, // Accelerating
          { time: 180, latitude: 40.7577, longitude: -73.9858, speed: 8.7 }, // Decelerating
          { time: 240, latitude: 40.7576, longitude: -73.9859, speed: 0 }, // Stopped
        ],
      };

      mockConsumerService.handleStartProcess.mockResolvedValue(undefined);

      await controller.handleStartProcess(gpsTrackingModel);

      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        gpsTrackingModel,
      );
      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledTimes(1);
    });

    it('should handle extreme coordinate values', async () => {
      const extremeCoordinatesModel: StartProcessDto = {
        deviceId: 'extreme-coords-123',
        RecordedDate: 1735683480000,
        details: [
          { latitude: 90, longitude: 180, speed: 0 }, // Max valid coordinates
          { latitude: -90, longitude: -180, speed: 1000 }, // Min valid coordinates
          { latitude: 0, longitude: 0, speed: 0 }, // Null Island
        ],
      };

      mockConsumerService.handleStartProcess.mockResolvedValue(undefined);

      await controller.handleStartProcess(extremeCoordinatesModel);

      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        extremeCoordinatesModel,
      );
      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledTimes(1);
    });

    it('should handle service throwing custom error', async () => {
      const validModel: StartProcessDto = {
        deviceId: 'custom-error-device',
        RecordedDate: 1735683480000,
        details: [{ time: 123, latitude: 51.1, longitude: 12.1, speed: 10 }],
      };

      const customError = new Error('Custom validation error');
      customError.name = 'ValidationError';
      mockConsumerService.handleStartProcess.mockRejectedValue(customError);

      await expect(controller.handleStartProcess(validModel)).rejects.toThrow(
        'Custom validation error',
      );
      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        validModel,
      );
    });
  });

  describe('handleGetData', () => {
    it('should retrieve data successfully', async () => {
      const filterModel: FilterProcessDto = {
        deviceId: '66bb584d4ae73e488c30a072',
      };

      const mockResponse = {
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
            createdDate: '2025-01-11T07:58:33.580Z',
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
            createdDate: '2025-01-11T07:58:33.588Z',
            __v: 0,
          },
        ],
        message: null,
      };

      mockConsumerService.handleGetData.mockResolvedValue(mockResponse);

      const result = await controller.handleGetData(filterModel);

      expect(mockConsumerService.handleGetData).toHaveBeenCalledWith(
        filterModel,
      );
      expect(mockConsumerService.handleGetData).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
      expect(result.succeed).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should handle empty result set', async () => {
      const filterModel: FilterProcessDto = {
        deviceId: 'nonexistent-device-123',
      };

      const mockEmptyResponse = {
        succeed: true,
        data: [],
        message: null,
      };

      mockConsumerService.handleGetData.mockResolvedValue(mockEmptyResponse);

      const result = await controller.handleGetData(filterModel);

      expect(mockConsumerService.handleGetData).toHaveBeenCalledWith(
        filterModel,
      );
      expect(mockConsumerService.handleGetData).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockEmptyResponse);
      expect(result.data).toHaveLength(0);
    });

    it('should handle service error response', async () => {
      const filterModel: FilterProcessDto = {
        deviceId: 'error-device-123',
      };

      const mockErrorResponse = {
        succeed: false,
        data: null,
        message: 'Database query failed',
      };

      mockConsumerService.handleGetData.mockResolvedValue(mockErrorResponse);

      const result = await controller.handleGetData(filterModel);

      expect(mockConsumerService.handleGetData).toHaveBeenCalledWith(
        filterModel,
      );
      expect(mockConsumerService.handleGetData).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockErrorResponse);
      expect(result.succeed).toBe(false);
      expect(result.data).toBe(null);
    });

    it('should propagate service exceptions', async () => {
      const filterModel: FilterProcessDto = {
        deviceId: 'exception-device-123',
      };

      const serviceError = new Error('Database connection timeout');
      mockConsumerService.handleGetData.mockRejectedValue(serviceError);

      await expect(controller.handleGetData(filterModel)).rejects.toThrow(
        'Database connection timeout',
      );

      expect(mockConsumerService.handleGetData).toHaveBeenCalledWith(
        filterModel,
      );
      expect(mockConsumerService.handleGetData).toHaveBeenCalledTimes(1);
    });

    it('should handle different device ID formats', async () => {
      const testCases = [
        { deviceId: '66bb584d4ae73e488c30a072' }, // MongoDB ObjectId format
        { deviceId: 'DEVICE_123' }, // Alphanumeric
        { deviceId: 'device-with-dashes-123' }, // With dashes
        { deviceId: 'device_with_underscores_123' }, // With underscores
        { deviceId: '12345' }, // Numeric
      ];

      const mockResponse = {
        succeed: true,
        data: [],
        message: null,
      };

      mockConsumerService.handleGetData.mockResolvedValue(mockResponse);

      for (const testCase of testCases) {
        await controller.handleGetData(testCase);
        expect(mockConsumerService.handleGetData).toHaveBeenCalledWith(
          testCase,
        );
      }

      expect(mockConsumerService.handleGetData).toHaveBeenCalledTimes(
        testCases.length,
      );
    });

    it('should handle large result datasets', async () => {
      const filterModel: FilterProcessDto = {
        deviceId: 'bulk-data-device',
      };

      // Mock large dataset response
      const largeDataArray = Array.from({ length: 1000 }, (_, index) => ({
        _id: `id_${index}`,
        RecordedDate: new Date(Date.now() + index * 1000).toISOString(),
        deviceId: 'bulk-data-device',
        time: index,
        latitude: 51.339764 + index * 0.0001,
        longitude: 12.339224 + index * 0.0001,
        speed: Math.random() * 50,
        createdDate: new Date().toISOString(),
        __v: 0,
      }));

      const mockLargeResponse = {
        succeed: true,
        data: largeDataArray,
        message: null,
      };

      mockConsumerService.handleGetData.mockResolvedValue(mockLargeResponse);

      const result = await controller.handleGetData(filterModel);

      expect(mockConsumerService.handleGetData).toHaveBeenCalledWith(
        filterModel,
      );
      expect(result).toEqual(mockLargeResponse);
      expect(result.data).toHaveLength(1000);
    });

    it('should handle concurrent requests', async () => {
      const filterModel1: FilterProcessDto = { deviceId: 'device1' };
      const filterModel2: FilterProcessDto = { deviceId: 'device2' };
      const filterModel3: FilterProcessDto = { deviceId: 'device3' };

      const mockResponse1 = {
        succeed: true,
        data: [{ deviceId: 'device1' }],
        message: null,
      };
      const mockResponse2 = {
        succeed: true,
        data: [{ deviceId: 'device2' }],
        message: null,
      };
      const mockResponse3 = {
        succeed: true,
        data: [{ deviceId: 'device3' }],
        message: null,
      };

      mockConsumerService.handleGetData
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2)
        .mockResolvedValueOnce(mockResponse3);

      const promises = [
        controller.handleGetData(filterModel1),
        controller.handleGetData(filterModel2),
        controller.handleGetData(filterModel3),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(mockResponse1);
      expect(results[1]).toEqual(mockResponse2);
      expect(results[2]).toEqual(mockResponse3);
      expect(mockConsumerService.handleGetData).toHaveBeenCalledTimes(3);
    });

    it('should handle null/undefined filter gracefully', async () => {
      const mockResponse = {
        succeed: true,
        data: [],
        message: null,
      };

      mockConsumerService.handleGetData.mockResolvedValue(mockResponse);

      // Test with null
      const result1 = await controller.handleGetData(null as any);
      expect(result1).toEqual(mockResponse);

      // Test with undefined
      const result2 = await controller.handleGetData(undefined as any);
      expect(result2).toEqual(mockResponse);

      expect(mockConsumerService.handleGetData).toHaveBeenCalledTimes(2);
    });
  });

  describe('dependency injection', () => {
    it('should have consumerService injected', () => {
      expect((controller as any).consumerService).toBe(mockConsumerService);
    });

    it('should call service methods with correct context', async () => {
      const model: StartProcessDto = {
        deviceId: 'test-device',
        RecordedDate: 1735683480000,
        details: [{ time: 123, latitude: 51.1, longitude: 12.1, speed: 10 }],
      };

      mockConsumerService.handleStartProcess.mockResolvedValue(undefined);

      await controller.handleStartProcess(model);

      expect(mockConsumerService.handleStartProcess).toHaveBeenCalledWith(
        model,
      );
      expect(mockConsumerService.handleStartProcess.mock.instances[0]).toBe(
        mockConsumerService,
      );
    });
  });

  describe('message patterns', () => {
    it('should be decorated with correct EventPattern', () => {
      const handleStartProcessMethod = controller.handleStartProcess;
      expect(handleStartProcessMethod).toBeDefined();
      expect(typeof handleStartProcessMethod).toBe('function');
    });

    it('should be decorated with correct MessagePattern', () => {
      const handleGetDataMethod = controller.handleGetData;
      expect(handleGetDataMethod).toBeDefined();
      expect(typeof handleGetDataMethod).toBe('function');
    });
  });

  describe('error handling scenarios', () => {
    it('should handle async operation failures in handleStartProcess', async () => {
      const model: StartProcessDto = {
        deviceId: 'async-error-device',
        RecordedDate: 1735683480000,
        details: [{ time: 123, latitude: 51.1, longitude: 12.1, speed: 10 }],
      };

      const asyncError = new Error('Async operation failed');
      mockConsumerService.handleStartProcess.mockRejectedValue(asyncError);

      await expect(controller.handleStartProcess(model)).rejects.toThrow(
        'Async operation failed',
      );
    });

    it('should handle async operation failures in handleGetData', async () => {
      const model: FilterProcessDto = { deviceId: 'async-error-device' };

      const asyncError = new Error('Async query failed');
      mockConsumerService.handleGetData.mockRejectedValue(asyncError);

      await expect(controller.handleGetData(model)).rejects.toThrow(
        'Async query failed',
      );
    });

    it('should handle timeout scenarios', async () => {
      const model: FilterProcessDto = { deviceId: 'timeout-device' };

      const timeoutError = new Error('Operation timed out');
      timeoutError.name = 'TimeoutError';
      mockConsumerService.handleGetData.mockRejectedValue(timeoutError);

      await expect(controller.handleGetData(model)).rejects.toThrow(
        'Operation timed out',
      );
    });
  });
});
