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
    private readonly subscribeService: SubscribeService,
    private readonly sonminsuRequestSevice: SonminsuRequestService,
    private readonly sonminsuRequestBookmarkService: SonminsuRequestBookmarkService,
    private readonly sonminsuAnswerService: SonminsuAnswerService,
    private readonly sonminsuItemService: SonminsuItemService,
    private readonly feedService: FeedService,
    private readonly followService: FollowService,
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
