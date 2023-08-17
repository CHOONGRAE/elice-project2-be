import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setups/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from './data-access/prisma/prisma.service';

const validationPipeConifg = {
  whitelist: true,
  // forbidNonWhitelisted: true,
  errorHttpStatusCode: 400,
};

const validationPipe = new ValidationPipe(validationPipeConifg);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Origin', 'X-Request-With', 'Content-Type', 'Accept'],
  });

  app.use(cookieParser());

  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks(app);

  setupSwagger(app);

  app.useGlobalPipes(validationPipe);

  await app.listen(5000);
}
bootstrap();
