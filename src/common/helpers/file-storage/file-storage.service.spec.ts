import { Test, TestingModule } from '@nestjs/testing';
import { FileStorageService } from './file-storage.service';
import { AppConfiguration } from 'src/config/app.config';

describe('FileStorageService', () => {
  let service: FileStorageService;

  const mockAppConfig = {
    gcsProjectId: 'test-project',
    gcsBucketName: 'test-bucket',
    gcsKeyFilePath: '/path/to/key.json',
    gcsCredentials: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileStorageService,
        {
          provide: AppConfiguration,
          useValue: mockAppConfig,
        },
      ],
    }).compile();

    service = module.get<FileStorageService>(FileStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
