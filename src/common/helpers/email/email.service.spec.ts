import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { AppConfiguration } from 'src/config/app.config';

describe('EmailService', () => {
  let service: EmailService;

  const mockAppConfig = {
    emailFrom: 'from@example.com',
    resendApiKey: 'test-api-key',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: AppConfiguration,
          useValue: mockAppConfig,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
