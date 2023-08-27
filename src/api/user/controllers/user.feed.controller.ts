import { FeedService } from '@api/feed/feed.service';
import { LikeService } from '@api/like/like.service';
import { User } from '@decorator/User.decorator';
import { CreateFeedDto } from '@dto/feedDto/create-feed.dto';
import { PaginateFeedDto } from '@dto/feedDto/paginate-feed.dto';
import { UpdateFeedDto } from '@dto/feedDto/update-feed.dto';
import { AuthGuard } from '@guards/auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller({
  path: 'users/feeds',
  version: '1',
})
@ApiTags('Users / Feeds API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserFeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly likeService: LikeService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '피드 목록',
  })
  async getFeeds(@User() userId: number, @Query() pagination: PaginateFeedDto) {
    return await this.feedService.getFeedsByUser(userId, pagination);
  }

  @Get('my')
  @ApiOperation({
    summary: '내가 작성한 피드 목록',
  })
  async getFeedsByUser(
    @User() userId: number,
    @Query() pagination: PaginateFeedDto,
  ) {
    return await this.feedService.getFeedsByAuthor(userId, pagination);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (/image/i.test(file.mimetype)) {
          file.originalname = Buffer.from(file.originalname, 'latin1').toString(
            'utf-8',
          );
          cb(null, true);
        } else cb(new BadRequestException(), true);
      },
    }),
  )
  @ApiOperation({
    summary: '피드 생성',
  })
  async createFeed(
    @User() userId: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() createFeedDto: CreateFeedDto,
  ) {
    return await this.feedService.createFeed(userId, {
      ...createFeedDto,
      image,
    });
  }

  @Patch(':feedId')
  @ApiOperation({
    summary: '피드 수정',
  })
  async updateFeed(
    @User() userId: number,
    @Param('feedId') feedId: number,
    @Body() updateFeedDto: UpdateFeedDto,
  ) {
    return await this.feedService.updateFeed(userId, feedId, updateFeedDto);
  }

  @Delete(':feedId')
  @ApiOperation({
    summary: '피드 삭제',
  })
  async deleteFeed(@User() userId: number, @Param('feedId') feedId: number) {
    await this.feedService.deleteFeed(feedId, userId);
  }

  @Put(':feedId/like')
  @ApiOperation({
    summary: '좋아요 토글',
  })
  async toggleLike(@Param('feedId') feedId: number, @User() userId: number) {
    await this.likeService.changeLikeStatus({ feedId, userId });
  }
}
