import { AppConfiguration } from './app.config';
import { ConfigService } from '@nestjs/config';

describe('AppConfiguration', () => {
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        const mockConfig: Record<string, string> = {
          PORT: '3000',
          SERVER_IP: '0.0.0.0',
          JWT_SECRET: 'test-secret-key-with-at-least-32-characters',
          JWT_SECRET_EXPIRE: '3600',
          EMAIL_FROM: 'from@example.com',
          RESEND_API_KEY: 'test-resend-api-key',
          CACHE_TTL: '3600',
          GCS_PROJECT_ID: 'test-project-id',
          GCS_BUCKET_NAME: 'test-bucket',
          GCS_KEY_FILE_PATH: '',
          GCS_CREDENTIALS: '',
        };
        return mockConfig[key];
      }),
    } as any;
  });

  it('should be defined', () => {
    const appConfig = new AppConfiguration(mockConfigService);
    expect(appConfig).toBeDefined();
  });

  it('should load configuration values correctly', () => {
    const appConfig = new AppConfiguration(mockConfigService);
    expect(appConfig.port).toBe(3000);
    expect(appConfig.serverIp).toBe('0.0.0.0');
    expect(appConfig.jwtSecret).toBe(
      'test-secret-key-with-at-least-32-characters',
    );
  });
});
