import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FandomModule } from '@api/fandom/fandom.module';
import { SonminsuRequestModule } from '@api/sonminsu-request/sonminsu-request.module';
import { SonminsuRequestBookmarkModule } from '@api/sonminsu-request-bookmark/sonminsu-request-bookmark.module';
import { SubscribeModule } from '@api/subscribe/subscribe.module';
import { FollowModule } from '@api/follow/follow.module';
import { FeedModule } from '@api/feed/feed.module';

@Module({
  imports: [
    FandomModule,
    SubscribeModule,
    SonminsuRequestModule,
    SonminsuRequestBookmarkModule,
    FeedModule,
    FollowModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
