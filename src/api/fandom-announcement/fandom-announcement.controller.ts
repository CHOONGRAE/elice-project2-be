import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FandomAnnouncementService } from './fandom-announcement.service';

@Controller({
  path: 'fandom-announcements',
  version: '1',
})
@ApiTags('FandomAnnouncements API')
export class FandomAnnouncementController {
  constructor(
    private readonly fandomAnnouncementService: FandomAnnouncementService,
  ) {}

  @Get(':fandomId')
  @ApiOperation({
    summary: '팬덤 공지',
  })
  async getFandomAnnouncement(@Param('fandomId') id: number) {
    return await this.fandomAnnouncementService.getFandomAnnouncementsByFandomId(
      id,
    );
  }
}
