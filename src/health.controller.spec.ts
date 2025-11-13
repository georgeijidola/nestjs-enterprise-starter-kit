import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health/health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: any;

  beforeEach(async () => {
    const mockHealthService = {
      checkAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call checkHealth when GET /health', async () => {
    const mockResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        cache: 'healthy',
      },
    };
    service.checkAll.mockResolvedValue(mockResult);

    const result = await controller.checkHealth();
    expect(result).toEqual(mockResult);
    expect(service.checkAll).toHaveBeenCalled();
  });
});
