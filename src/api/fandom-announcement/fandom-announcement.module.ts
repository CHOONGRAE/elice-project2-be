import { Module } from '@nestjs/common';
import { FandomAnnouncementController } from './fandom-announcement.controller';
import { FandomAnnouncementService } from './fandom-announcement.service';

@Module({
  controllers: [FandomAnnouncementController],
  providers: [FandomAnnouncementService],
  exports: [FandomAnnouncementService],
})
export class FandomAnnouncementModule {}
