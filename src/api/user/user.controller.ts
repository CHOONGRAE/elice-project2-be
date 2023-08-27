import { AuthGuard } from '@guards/auth.guard';
import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@decorator/User.decorator';
import { FollowService } from '@api/follow/follow.service';

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
