import { FollowService } from '@api/follow/follow.service';
import { User } from '@decorator/User.decorator';
import { PaginateFollowDto } from '@dto/followDto/paginate-follow.dto';
import { AuthGuard } from '@guards/auth.guard';
import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users / Follows API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserFollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('following/:userId')
  @ApiOperation({
    summary: '팔로잉 목록',
  })
  async getFollows(
    @User() id: number,
    @Param('userId') userId: number,
    @Query() pagination: PaginateFollowDto,
  ) {
    return await this.followService.getFollowsByUser(id, userId, pagination);
  }

  @Get('followers/:userId')
  @ApiOperation({
    summary: '팔로워 목록',
  })
  async getFollowers(
    @User() id: number,
    @Param('userId') userId: number,
    @Query() pagination: PaginateFollowDto,
  ) {
    return await this.followService.getFollowersByUser(id, userId, pagination);
  }

  @Get('isFollowing/:userId')
  @ApiOperation({
    summary: '내가 저사람 팔로잉 했어?',
  })
  async getIsFollowing(
    @User() userId: number,
    @Param('userId') followId: number,
  ) {
    return await this.followService.getIsFollowing(userId, followId);
  }

  @Put('following/:followId')
  @ApiOperation({
    summary: '팔로잉 상태 변경',
  })
  async toggleFollow(
    @User() userId: number,
    @Param('followId') followId: number,
  ) {
    await this.followService.changeFollowStatus({ userId, followId });
  }
}
