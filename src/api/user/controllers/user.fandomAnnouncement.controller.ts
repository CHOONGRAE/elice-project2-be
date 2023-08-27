import { FandomAnnouncementService } from '@api/fandom-announcement/fandom-announcement.service';
import { User } from '@decorator/User.decorator';
import { CreateFandomAnnouncementDto } from '@dto/fandomAnnouncement/create-announcement.dto';
import { UpdateFandomAnnouncementDto } from '@dto/fandomAnnouncement/update-announcement.dto';
import { AuthGuard } from '@guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'users/fandom-announcements',
  version: '1',
})
@ApiTags('Users / FandomAnnouncements API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserFandomAnnouncementController {
  constructor(
    private readonly fandomAnnouncementService: FandomAnnouncementService,
  ) {}

  @Post(':fandomId')
  @ApiOperation({
    summary: '팬덤 공지 작성',
  })
  async createFandomAnnouncement(
    @User() userId: number,
    @Param('fandomId') fandomId: number,
    @Body() createFandomAnnouncementDto: CreateFandomAnnouncementDto,
  ) {
    return await this.fandomAnnouncementService.createFandomAnnouncement(
      userId,
      fandomId,
      createFandomAnnouncementDto,
    );
  }

  @Patch(':announcementId')
  @ApiOperation({
    summary: '팬덤 공지 수정',
  })
  async updateFandomAnnouncement(
    @Param('announcementId') id: number,
    @User() userId: number,
    @Body() updateFandomAnnouncementDto: UpdateFandomAnnouncementDto,
  ) {
    return await this.fandomAnnouncementService.updateFandomAnnouncement(
      id,
      userId,
      updateFandomAnnouncementDto,
    );
  }

  @Delete(':announcementId')
  @ApiOperation({
    summary: '팬덤 공지 삭제',
  })
  async deleteFandomAnnouncement(
    @Param('announcementId') id: number,
    @User() userId: number,
  ) {
    await this.fandomAnnouncementService.deleteFandomAnnouncement(id, userId);
  }
}
