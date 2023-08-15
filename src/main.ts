import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

const validationPipeConifg = {
  whitelist: true,
  forbidNonWhitelisted: true,
  errorHttpStatusCode: 400,
};

const validationPipe = new ValidationPipe(validationPipeConifg);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  setupSwagger(app);

  await app.listen(5000);

  app.useGlobalPipes(validationPipe);
}
bootstrap();
