import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '@common/exceptions/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser(configService.getOrThrow('SECRET')));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('saju')
    .setDescription('saju API description')
    .setVersion('2.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'refresh-token',
    )
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = configService.get('PORT');
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
