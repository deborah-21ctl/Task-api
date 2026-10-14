import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor.js';
import { ApiResponseInterceptor } from './common/interceptors/api-response/api-response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors) => {
        const errors = validationErrors.reduce<Record<string, string[]>>(
          (result, error) => {
            result[error.property] = Object.values(error.constraints ?? {});
            return result;
          },
          {},
        );

        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Wrap every successful route response in { statusCode, message, data }.
  // Keep logging after the wrapper so the interceptor logs the final HTTP response.
  app.useGlobalInterceptors(
    new ApiResponseInterceptor(),
    new LoggingInterceptor(),
  );

  const config = new DocumentBuilder()
  .setTitle('Task Management API')
  .setDescription(
    [
      'REST API for managing accounts, projects, and project tasks.',
      '',
      'Authentication: create an account with POST /auth/register, then sign in with POST /auth/login. Copy the returned access_token and select Authorize to use protected endpoints. Enter the token as a bearer token; do not include the word "Bearer" if the Swagger dialog adds it automatically.',
      '',
      'Authorization: project and task endpoints operate on resources owned by the authenticated user. POST /auth/post-admin is restricted to accounts with the ADMIN role.',
      '',
      'Validation: request bodies are validated, and unknown properties are rejected.',
      'Successful responses include statusCode and message fields, with the endpoint result in data when present.',
    ].join('\n'),
  )
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token',
  )
  .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
