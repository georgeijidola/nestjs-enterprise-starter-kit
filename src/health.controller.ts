import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthService } from './health/health.service';
import { CheckHealthSwagger } from './health/decorators/swagger.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @CheckHealthSwagger()
  @Get()
  async checkHealth() {
    return this.healthService.checkAll();
  }
}
