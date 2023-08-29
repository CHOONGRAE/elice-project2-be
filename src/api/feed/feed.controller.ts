import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginateFeedDto } from '@dto/feedDto/paginate-feed.dto';

@Controller({
  path: 'feeds',
  version: '1',
})
@ApiTags('Feeds API')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeeds(@Query() paginateFeedDto: PaginateFeedDto) {
    return await this.feedService.getFeeds(paginateFeedDto);
  }

  @Get(':id')
  async getFeedById(@Param('id') id: number) {
    return await this.feedService.getFeedById(id);
  }

  @Get('users/:userId')
  @ApiOperation({
    summary: '유저 피드 목록',
  })
  async getFeedsByUser(
    @Param('userId') userId: number,
    @Query() pagination: PaginateFeedDto,
  ) {
    return await this.feedService.getFeedsByAuthor(userId, pagination);
  }
}
