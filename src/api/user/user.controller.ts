import { AuthGuard } from '@guards/auth.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FollowService } from '@api/follow/follow.service';

@Controller({
  path: '/',
  version: '1',
})
@ApiTags('Users API')
// @UseGuards(AuthGuard)
// @ApiBearerAuth('Authorization')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly followService: FollowService,
  ) {}

  @Get('fesfosfos/:userId')
  @ApiOperation({
    summary: '피드 팔로우 팔로워 수',
  })
  async getFesFosFos(@Param('userId') userId: number) {
    return await this.userService.getFesFosFos(userId);
  }
}
