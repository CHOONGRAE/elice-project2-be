import { Controller, Get, Param, Query } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginateFollowDto } from '@dto/followDto/paginate-follow.dto';

@Controller({
  path: '/',
  version: '1',
})
@ApiTags('Follows API')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('follows/:userId')
  @ApiOperation({
    summary: '팔로우 목록',
  })
  async getFollows(
    @Param('userId') userId: number,
    @Query() pagination: PaginateFollowDto,
  ) {
    return await this.followService.getFollows(userId, pagination);
  }

  @Get('followers:userId')
  @ApiOperation({
    summary: '팔로워 목록',
  })
  async getFollowers(
    @Param('userId') userId: number,
    @Query() pagination: PaginateFollowDto,
  ) {
    return await this.followService.getFollowers(userId, pagination);
  }
}
