import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new LoggingInterceptor());

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
