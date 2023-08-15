import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setups/swagger';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

const validationPipeConifg = {
  whitelist: true,
  // forbidNonWhitelisted: true,
  errorHttpStatusCode: 400,
};

const validationPipe = new ValidationPipe(validationPipeConifg);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  setupSwagger(app);

  app.useGlobalPipes(validationPipe);

  await app.listen(5000);
}
bootstrap();
