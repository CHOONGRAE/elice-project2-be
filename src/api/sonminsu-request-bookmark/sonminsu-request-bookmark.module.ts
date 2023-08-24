import { Module } from '@nestjs/common';
import { SonminsuRequestBookmarkService } from './sonminsu-request-bookmark.service';

@Module({
  providers: [SonminsuRequestBookmarkService],
  exports: [SonminsuRequestBookmarkService],
})
export class SonminsuRequestBookmarkModule {}
