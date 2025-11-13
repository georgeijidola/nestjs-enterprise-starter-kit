import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyMultipart from '@fastify/multipart';
import { AllExceptionFilter } from 'src/common/api/filters/all-exception/all-exception.filter';

export const FastifyLoader = (app: NestFastifyApplication) => {
  app.setGlobalPrefix('api');

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());

  const fastifyInstance = app.getHttpAdapter().getInstance();

  fastifyInstance.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  fastifyInstance.addHook('onRequest', (request, reply, done) => {
    reply.setHeader = function (key, value) {
      return this.raw.setHeader(key, value);
    };

    reply.end = function (...args) {
      return this.raw.end(...args);
    };

    reply.statusCode = HttpStatus.OK;

    request.res = reply;

    done();
  });

  fastifyInstance.addHook(
    'preSerialization',
    (request, reply, payload, done) => {
      if (typeof payload === 'object' && payload !== null) {
        const serializedPayload = JSON.parse(
          JSON.stringify(payload, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          ),
        );
        done(null, serializedPayload);
      } else {
        done(null, payload);
      }
    },
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Enterprise Starter Kit')
    .setDescription('The NestJS Enterprise Starter Kit API specification')
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description:
          'API Key for accessing the API. Can also be passed as Bearer token or query parameter.',
      },
      'api-key',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Apply api-key security globally to all endpoints
  if (document.paths) {
    Object.keys(document.paths).forEach((path) => {
      Object.keys(document.paths[path]).forEach((method) => {
        const operation = document.paths[path][method];
        if (operation && !operation.security) {
          operation.security = [{ 'api-key': [] }];
        } else if (operation && operation.security) {
          // Add api-key to existing security if not already present
          const hasApiKey = operation.security.some((sec) => sec['api-key']);
          if (!hasApiKey) {
            operation.security.push({ 'api-key': [] });
          }
        }
      });
    });
  }

  SwaggerModule.setup('docs', app, document);
};
