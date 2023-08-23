import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { RedisModule } from '@redis/redis.module';
import { MailerModule } from '@mailer';
import { AuthModule } from '@api/auth/auth.module';
import { JwtModule } from '@jwt';
import { ScraperModule } from '@scraper';
import { S3Module } from '@s3';
import { FollowModule } from './follow/follow.module';
import { FandomModule } from './fandom/fandom.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    RedisModule,
    MailerModule,
    JwtModule,
    ScraperModule,
    S3Module,
    FollowModule,
    FandomModule,
  ],
})
export class ApiModule {}
