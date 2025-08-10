import { Test, TestingModule } from '@nestjs/testing';
import { SharedLoggerService } from './shared.logger.service';

describe('SharedLoggerService', () => {
  let service: SharedLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedLoggerService],
    }).compile();

    service = module.get<SharedLoggerService>(SharedLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
