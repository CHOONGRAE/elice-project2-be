import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  setupSwagger(app);

  await app.listen(5000);
}
bootstrap();
