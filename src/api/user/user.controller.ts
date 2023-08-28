import { AuthGuard } from '@guards/auth.guard';
import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@decorator/User.decorator';
import { FollowService } from '@api/follow/follow.service';
import { PaginateFollowDto } from '@dto/followDto/paginate-follow.dto';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly followService: FollowService,
  ) {}

  @Get('follows')
  @ApiOperation({
    summary: '팔로우 목록',
  })
  async getFollows(
    @User() userId: number,
    @Query() pagination: PaginateFollowDto,
  ) {
    return await this.followService.getFollows(userId, pagination);
  }

  @Get('followers')
  @ApiOperation({
    summary: '팔로워 목록',
  })
  async getFollowers(
    @User() userId: number,
    @Query() pagination: PaginateFollowDto,
  ) {
    return await this.followService.getFollowers(userId, pagination);
  }

  @Put('follows/:followId')
  @ApiOperation({
    summary: '팔로우 상태 변경',
  })
  async toggleFollow(
    @User() userId: number,
    @Param('followId') followId: number,
  ) {
    await this.followService.changeFollowStatus({ userId, followId });
  }
}
