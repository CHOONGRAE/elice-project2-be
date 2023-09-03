import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setups/swagger';
import {
  ValidationPipe,
  ValidationPipeOptions,
  VersioningType,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from './data-access/prisma/prisma.service';
import { SocketIoAdapter } from './chat/socket-io.adapter';
import * as expressBasicAuth from 'express-basic-auth';

process.env.NODE_ENV =
  process.env.NODE_ENV && /prod/i.test(process.env.NODE_ENV)
    ? 'production'
    : 'development';

const validationPipeConifg: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  errorHttpStatusCode: 400,
};

if (process.env.NODE_ENV === 'production') {
  validationPipeConifg.forbidNonWhitelisted = true;
}

const validationPipe = new ValidationPipe(validationPipeConifg);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
      exposedHeaders: ['Authorization'],
      allowedHeaders: [
        'Origin',
        'X-Request-With',
        'Content-Type',
        'Accept',
        'Authorization',
      ],
    });
  }

  app.use(cookieParser());

  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(validationPipe);

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  app.use(
    ['/api-docs'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
    }),
  );

  setupSwagger(app);

  await app.listen(5000);
}

bootstrap();
