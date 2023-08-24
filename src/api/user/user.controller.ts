import { AuthGuard } from '@guards/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FandomService } from '@api/fandom/fandom.service';
import { Request } from 'express';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users API')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fandomService: FandomService,
  ) {}

  @Get('fandoms')
  async getFandoms(@Req() req: Request) {
    const { id } = req['user'];
    return await this.fandomService.getFandomsByUser(id);
  }

  @Post('fandoms')
  async createFandom() {}

  @Patch('fandoms/:id')
  async updateFandom() {}

  @Delete('fandoms/:id')
  async deleteFandom() {}

  @Get('feeds')
  async getFeeds() {}

  @Post('feeds')
  async createFeed() {}

  @Get('feeds/my')
  async getMyFeeds() {}

  @Patch('feeds/:id')
  async updateFeed() {}

  @Delete('feeds/:id')
  async deleteFeed() {}

  @Get('sonminsu-requests')
  async getSonminsuRequests() {}

  @Get('sonminsu-requests/done')
  async getSonminsuRequestsDone() {}

  @Get('sonminsu-requests/bookmarks')
  async getSonminsuRequestBookmarks() {}

  @Get('sonminsu-requests/bookmarks/toggle/:id')
  async toggleSonminsuRequestBookmark() {}

  @Get('follows')
  async getFollows() {}

  @Get('followers')
  async getFollowers() {}

  @Put('follows/toggle/:id')
  async toggleFollow() {}
}
