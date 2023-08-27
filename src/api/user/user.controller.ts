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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { FandomService } from '@api/fandom/fandom.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFandomDto } from '@dto/fandomDto/create-fandom.dto';
import { UpdateFandomDto } from '@dto/fandomDto/update-fandom.dto';
import { User } from '@decorator/User.decorator';
import { SonminsuRequestService } from '@api/sonminsu-request/sonminsu-request.service';
import { GetSonminsuRequestDto } from '@dto/sonminsuRequestDto/get-sonmisuRequest.dto';
import { PaginateSonminsuRequestDto } from '@dto/sonminsuRequestDto/paginate-sonminsuRequest.dto';
import { SonminsuRequestBookmarkService } from '@api/sonminsu-request-bookmark/sonminsu-request-bookmark.service';
import { CreateSonminsuRequestDto } from '@dto/sonminsuRequestDto/create-sonminsuRequest.dto';
import { UpdateSonminsuRequestDto } from '@dto/sonminsuRequestDto/update-sonminsuRequest.dto';
import { PaginateFandomDto } from '@dto/fandomDto/paginate-fandom.dto';
import { SubscribeService } from '@api/subscribe/subscribe.service';
import { FollowService } from '@api/follow/follow.service';
import { CreateFeedDto } from '@dto/feedDto/create-feed.dto';
import { FeedService } from '@api/feed/feed.service';
import { UpdateFeedDto } from '@dto/feedDto/update-feed.dto';
import { PaginateFeedDto } from '@dto/feedDto/paginate-feed.dto';
import { SonminsuAnswerService } from '@api/sonminsu-answer/sonminsu-answer.service';
import { CreateSonminsuAnswerDto } from '@dto/sonminsuAnswerDto/create-sonminsuAnswer.dto';
import { UpdateSonminsuAnswerDto } from '@dto/sonminsuAnswerDto/update-sonminsuAnswer.dto';
import { CreateSonminsuItemDto } from '@dto/sonminsuItemDto/create-sonminsuItem.dto';
import { SonminsuItemService } from '@api/sonminsu-item/sonminsu-item.service';
import { CreateCommentDto } from '@dto/commentDto/create-comment.dto';
import { CommentService } from '@api/comment/comment.service';
import { LikeService } from '@api/like/like.service';
import { FandomAnnouncementService } from '@api/fandom-announcement/fandom-announcement.service';
import { CreateFandomAnnouncementDto } from '@dto/fandomAnnouncement/create-announcement.dto';
import { UpdateFandomAnnouncementDto } from '@dto/fandomAnnouncement/update-announcement.dto';
import { CreateBucketDto } from '@dto/bucketDto/create-bucket.dto';
import { BucketService } from '@api/bucket/bucket.service';
import { BucketItemService } from '@api/bucket-item/bucket-item.service';

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
    private readonly fandomService: FandomService,
    private readonly fandomAnnouncementService: FandomAnnouncementService,
    private readonly subscribeService: SubscribeService,
    private readonly sonminsuRequestSevice: SonminsuRequestService,
    private readonly sonminsuRequestBookmarkService: SonminsuRequestBookmarkService,
    private readonly sonminsuAnswerService: SonminsuAnswerService,
    private readonly sonminsuItemService: SonminsuItemService,
    private readonly bucketService: BucketService,
    private readonly bucketItemService: BucketItemService,
    private readonly feedService: FeedService,
    private readonly commentService: CommentService,
    private readonly followService: FollowService,
    private readonly likeService: LikeService,
  ) {}

  @Get('fandoms')
  @ApiOperation({
    summary: '가입한 팬덤 목록',
  })
  async getFandoms(
    @User() id: number,
    @Query() paginateFandomDto: PaginateFandomDto,
  ) {
    return await this.fandomService.getFandomsByUser(id, paginateFandomDto);
  }

  @Post('fandoms')
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
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '팬덤 생성',
  })
  async createFandom(
    @UploadedFile() file: Express.Multer.File,
    @User() userId: number,
    @Body() createFandomDto: CreateFandomDto,
  ) {
    return await this.fandomService.createFandom({
      userId,
      ...createFandomDto,
      file,
    });
  }

  @Patch('fandoms/:fandomId')
  @UseInterceptors(
    FileInterceptor('file', {
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
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '팬덤 수정',
  })
  async updateFandom(
    @UploadedFile() file: Express.Multer.File,
    @Param('fandomId') id: number,
    @User() userId: number,
    @Body()
    updateFandomDto: UpdateFandomDto,
  ) {
    return await this.fandomService.updateFandom({
      id,
      userId,
      ...updateFandomDto,
      file,
    });
  }

  @Delete('fandoms/:fandomId')
  @ApiOperation({
    summary: '팬덤 삭제',
  })
  async deleteFandom(@Param('fandomId') id: number, @User() userId: number) {
    await this.fandomService.deleteFandom({ id, userId });
  }

  @Post('fandom-announcements/:fandomId')
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

  @Patch('fandom-announcements/:announcementId')
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

  @Delete('fandom-announcements/:announcementId')
  @ApiOperation({
    summary: '팬덤 공지 삭제',
  })
  async deleteFandomAnnouncement(
    @Param('announcementId') id: number,
    @User() userId: number,
  ) {
    await this.fandomAnnouncementService.deleteFandomAnnouncement(id, userId);
  }

  @Put('fandoms/:fandomId/subscribe')
  @ApiOperation({
    summary: '팬덤 구독 상태 변경',
  })
  async toggleFandomSubscribe(
    @User() userId: number,
    @Param('fandomId') fandomId: number,
  ) {
    await this.subscribeService.changeLikeStatus({ userId, fandomId });
  }

  @Get('sonminsu-requests')
  @ApiOperation({
    summary: '본인이 의뢰한 목록',
  })
  async getSonminsuRequests(
    @User() userId: number,
    @Query() getSonminsuRequestDto: GetSonminsuRequestDto,
  ) {
    return await this.sonminsuRequestSevice.getSonminsuRequestsByUser(
      userId,
      getSonminsuRequestDto,
    );
  }

  @Post('sonminsu-requests')
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
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '의뢰 작성',
  })
  async createSonminsuRequest(
    @User() userId: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() createSonminsuRequestDto: CreateSonminsuRequestDto,
  ) {
    return await this.sonminsuRequestSevice.createSonminsuRequest(userId, {
      ...createSonminsuRequestDto,
      image,
    });
  }

  @Get('sonminsu-requests/bookmarks')
  @ApiOperation({
    summary: '본인이 찜한 의뢰 목록',
  })
  async getSonminsuRequestBookmarks(
    @User() userId: number,
    @Query() paginateSonminsuRequestDto: PaginateSonminsuRequestDto,
  ) {
    return await this.sonminsuRequestSevice.getSonminsuRequestsByBookmark(
      userId,
      paginateSonminsuRequestDto,
    );
  }

  @Patch('sonminsu-requests/:requestId')
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
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '의뢰 수정',
  })
  async updateSonminsuRequest(
    @User() userId: number,
    @Param('requestId') requestId: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateSonminsuRequestDto: UpdateSonminsuRequestDto,
  ) {
    return await this.sonminsuRequestSevice.updateSonminsuRequest(
      requestId,
      userId,
      { ...updateSonminsuRequestDto, image },
    );
  }

  @Put('sonminsu-requests/:requestId/bookmarks')
  @ApiOperation({
    summary: '의뢰 북마크',
  })
  async toggleSonminsuRequestBookmark(
    @User() userId: number,
    @Param('requestId') requestId: number,
  ) {
    await this.sonminsuRequestBookmarkService.changeSonminsuRequestBookmarkStatus(
      { userId, requestId },
    );
  }

  @Post('sonminsu-answers/:requestId')
  @ApiOperation({
    summary: '의뢰 답변 작성',
  })
  async createSonminsuAnswer(
    @User() userId: number,
    @Param('requestId') requestId: number,
    @Body() createSonminsuAnswerDto: CreateSonminsuAnswerDto,
  ) {
    await this.sonminsuAnswerService.createSonminsuAnswer(
      userId,
      requestId,
      createSonminsuAnswerDto,
    );
  }

  @Patch('sonminsu-answers/:requestId')
  @ApiOperation({
    summary: '의뢰 답변 삭제',
  })
  async updateSonminsuAnswer(
    @User() userId: number,
    @Param('requestId') requestId: number,
    @Body() updateSonminsuAnswerDto: UpdateSonminsuAnswerDto,
  ) {
    await this.sonminsuAnswerService.updateSonminsuAnswer(
      requestId,
      userId,
      updateSonminsuAnswerDto,
    );
  }

  @Delete('sonminsu-answers/:requestId')
  @ApiOperation({
    summary: '의뢰 답변 삭제',
  })
  async deleteSonminsuAnswer(
    @User() userId: number,
    @Param('requestId') requestId: number,
  ) {
    await this.sonminsuAnswerService.deleteSonminsuAnswer(requestId, userId);
  }

  @Put('sonminsu-answers/:answerId/choose')
  @ApiOperation({
    summary: '의뢰 답변 채택',
  })
  async chooseSonminsuAnswer(
    @User() userId: number,
    @Param('requestId') answerId: number,
  ) {
    await this.sonminsuAnswerService.chooseSonminsuAnswer(answerId, userId);
  }

  @Post('sonminsu-item')
  @ApiOperation({
    summary: '손민수 아이템 임시 생성',
  })
  async createSonminsuItem(
    @Body() createSonminuItemDto: CreateSonminsuItemDto,
  ) {
    return await this.sonminsuItemService.createSonminsuItem(
      createSonminuItemDto,
    );
  }

  @Get('buckets')
  @ApiOperation({
    summary: '버킷 목록',
  })
  async getBuckets(@User() userId: number) {
    return await this.bucketService.getBuckets(userId);
  }

  @Get('buckets/:bucketId')
  @ApiOperation({
    summary: '버킷 상세',
  })
  async getBucketById(@User() userId: number, @Param('bucketId') id: number) {
    return await this.bucketService.getBucket(id, userId);
  }

  @Post('buckets')
  @ApiOperation({
    summary: '버킷 생성',
  })
  async createBucket(
    @User() userId: number,
    @Body() createBucketDto: CreateBucketDto,
  ) {
    return await this.bucketService.createBucket(userId, createBucketDto);
  }

  @Delete('buckets/:bucketId')
  @ApiOperation({
    summary: '버킷 삭제',
  })
  async deleteBucket(@Param('bucketId') id: number, @User() userId: number) {
    await this.bucketService.deleteBucket(id, userId);
  }

  @Put('buckets/:bucketId/toggle/:itemId')
  @ApiOperation({
    summary: '버킷에 아이템 담기',
  })
  async toggleBucketItem(
    @Param('bucketId') bucketId: number,
    @Param('itemId') itemId: number,
  ) {
    await this.bucketItemService.changeBucketItemStatus({ bucketId, itemId });
  }

  @Get('feeds')
  @ApiOperation({
    summary: '피드 목록',
  })
  async getFeeds(@User() userId: number, @Query() pagination: PaginateFeedDto) {
    return await this.feedService.getFeedsByUser(userId, pagination);
  }

  @Get('feeds/my')
  @ApiOperation({
    summary: '내가 작성한 피드 목록',
  })
  async getFeedsByUser(
    @User() userId: number,
    @Query() pagination: PaginateFeedDto,
  ) {
    return await this.feedService.getFeedsByAuthor(userId, pagination);
  }

  @Post('feeds')
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

  @Patch('feeds/:feedId')
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

  @Delete('feeds/:feedId')
  @ApiOperation({
    summary: '피드 삭제',
  })
  async deleteFeed(@User() userId: number, @Param('feedId') feedId: number) {
    await this.feedService.deleteFeed(feedId, userId);
  }

  @Put('feeds/:feedId/like')
  @ApiOperation({
    summary: '좋아요 토글',
  })
  async toggleLike(@Param('feedId') feedId: number, @User() userId: number) {
    await this.likeService.changeLikeStatus({ feedId, userId });
  }

  @Post('comments/:feedId')
  @ApiOperation({
    summary: '댓글 작성',
  })
  async createComment(
    @User() userId: number,
    @Param('feedId') feedId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.createComment(
      userId,
      feedId,
      createCommentDto,
    );
  }

  @Delete('comments/:commentId')
  @ApiOperation({
    summary: '댓글 삭제',
  })
  async deleteComment(@User() userId: number, @Param('commentId') id: number) {
    await this.commentService.deleteComment(id, userId);
  }

  @Put('follows/:followId/')
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
