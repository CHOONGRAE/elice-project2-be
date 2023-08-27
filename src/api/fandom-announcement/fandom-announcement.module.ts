import { Module } from '@nestjs/common';
import { FandomAnnouncementService } from './fandom-announcement.service';
import { FandomAnnouncementController } from './fandom-announcement.controller';

@Module({
  providers: [FandomAnnouncementService],
  exports: [FandomAnnouncementService],
  controllers: [FandomAnnouncementController],
})
export class FandomAnnouncementModule {}
