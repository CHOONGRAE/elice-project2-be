import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FandomModule } from '@api/fandom/fandom.module';
import { SonminsuRequestModule } from '@api/sonminsu-request/sonminsu-request.module';
import { SonminsuRequestBookmarkModule } from '@api/sonminsu-request-bookmark/sonminsu-request-bookmark.module';
import { SubscribeModule } from '@api/subscribe/subscribe.module';
import { FollowModule } from '@api/follow/follow.module';
import { FeedModule } from '@api/feed/feed.module';
import { SonminsuAnswerModule } from '@api/sonminsu-answer/sonminsu-answer.module';
import { SonminsuItemModule } from '@api/sonminsu-item/sonminsu-item.module';
import { CommentModule } from '@api/comment/comment.module';
import { LikeModule } from '@api/like/like.module';
import { FandomAnnouncementModule } from '@api/fandom-announcement/fandom-announcement.module';
import { BucketModule } from '@api/bucket/bucket.module';
import { BucketItemModule } from '@api/bucket-item/bucket-item.module';
import * as Controllers from './controllers';
import { S3Module } from '@s3';

@Module({
  imports: [
    FandomModule,
    FandomAnnouncementModule,
    SubscribeModule,
    SonminsuRequestModule,
    SonminsuRequestBookmarkModule,
    SonminsuAnswerModule,
    SonminsuItemModule,
    BucketModule,
    BucketItemModule,
    FeedModule,
    CommentModule,
    FollowModule,
    LikeModule,
    S3Module,
  ],
  providers: [UserService],
  controllers: [UserController, ...Object.values(Controllers)],
})
export class UserModule {}
