import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { RedisModule } from '@redis/redis.module';
import { MailerModule } from '@mailer';
import { AuthModule } from '@api/auth/auth.module';
import { JwtModule } from '@jwt';

@Module({
  imports: [AuthModule, PrismaModule, RedisModule, MailerModule, JwtModule],
})
export class ApiModule {}
