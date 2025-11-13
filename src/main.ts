import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AppConfiguration } from './config/app.config';
import { ExecutionTimeInterceptor } from './common/interceptors/execution-time.interceptor';
import { FastifyLoader } from './loaders/fastify/fastify.loader';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
        credentials: true,
      },
    },
  );
  app.useGlobalInterceptors(new ExecutionTimeInterceptor());

  const config = app.get(AppConfiguration);
  const { port, serverIp } = config;
  console.log({ port, serverIp });

  FastifyLoader(app);

  await app.listen(port, serverIp, async () => {
    const URL = await app.getUrl();

    console.log(`Server running on ${URL} 🚀\nAPI docs at ${URL}/docs`);
  });
}

bootstrap();
