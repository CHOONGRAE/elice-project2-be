import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { S3Module } from '@s3';
import { SonminsuItemModule } from '@api/sonminsu-item/sonminsu-item.module';
import { HashTagModule } from '@api/hash-tag/hash-tag.module';

@Module({
  imports: [S3Module, SonminsuItemModule, HashTagModule],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
