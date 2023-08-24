import { Module } from '@nestjs/common';
import { FandomAnnouncementService } from './fandom-announcement.service';

@Module({
  providers: [FandomAnnouncementService],
  exports: [FandomAnnouncementService],
})
export class FandomAnnouncementModule {}
