import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Base')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  getRoot() {
    return {
      message: 'Welcome to Ayo and Styles API',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/welcome')
  getWelcome(): string {
    return this.appService.getWelcome();
  }

  @Get('/status')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
