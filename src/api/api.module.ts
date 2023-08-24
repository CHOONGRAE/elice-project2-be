import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { RedisModule } from '@redis/redis.module';
import { MailerModule } from '@mailer';
import { AuthModule } from '@api/auth/auth.module';
import { JwtModule } from '@jwt';
import { S3Module } from '@s3';
import { FollowModule } from './follow/follow.module';
import { FandomModule } from './fandom/fandom.module';
import { SonminsuItemModule } from './sonminsu-item/sonminsu-item.module';
import { FeedModule } from './feed/feed.module';
import { FandomAnnouncementModule } from './fandom-announcement/fandom-announcement.module';
import { SonminsuRequestModule } from './sonminsu-request/sonminsu-request.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    RedisModule,
    MailerModule,
    JwtModule,
    S3Module,
    FollowModule,
    FandomModule,
    FandomAnnouncementModule,
    FeedModule,
    SonminsuRequestModule,
    SonminsuItemModule,
  ],
})
export class ApiModule {}
