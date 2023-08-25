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
  ApiParam,
  ApiProperty,
  ApiQuery,
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
    private readonly sonminsuRequestSevice: SonminsuRequestService,
    private readonly sonminsuRequestBookmarkService: SonminsuRequestBookmarkService,
  ) {}

  @Get('fandoms')
  @ApiOperation({
    summary: '가입한 팬덤 목록',
  })
  async getFandoms(@User('id') id: number) {
    return await this.fandomService.getFandomsByUser(id);
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
    @UploadedFile() image: Express.Multer.File,
    @User('sub') userId: number,
    @Body() createFandomDto: CreateFandomDto,
  ) {
    console.log(userId);
    return await this.fandomService.createFandom({
      userId,
      ...createFandomDto,
      image,
    });
  }

  @Patch('fandoms/:id')
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
    summary: '팬덤 수정',
  })
  @ApiParam({
    name: 'id',
    required: true,
  })
  async updateFandom(
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: number,
    @User('id') userId: number,
    @Body()
    updateFandomDto: UpdateFandomDto,
  ) {
    return await this.fandomService.updateFandom({
      id,
      userId,
      ...updateFandomDto,
      image,
    });
  }

  @Delete('fandoms/:id')
  @ApiOperation({
    summary: '팬덤 삭제',
  })
  @ApiParam({
    name: 'id',
    required: true,
  })
  async deleteFandom(@Param('id') id: number, @User('sub') userId: number) {
    await this.fandomService.deleteFandom({ id, userId });
  }

  // @Get('feeds')
  // async getFeeds() {}

  // @Post('feeds')
  // async createFeed() {}

  // @Get('feeds/my')
  // async getMyFeeds() {}

  // @Patch('feeds/:id')
  // async updateFeed() {}

  // @Delete('feeds/:id')
  // async deleteFeed() {}

  @Get('sonminsu-requests')
  @ApiOperation({
    summary: '본인이 의뢰한 목록',
  })
  async getSonminsuRequests(
    @User('sub') userId: number,
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
    @User('sub') userId: number,
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
    @User('sub') userId: number,
    @Query() paginateSonminsuRequestDto: PaginateSonminsuRequestDto,
  ) {
    return await this.sonminsuRequestSevice.getSonminsuRequestsByBookmark(
      userId,
      paginateSonminsuRequestDto,
    );
  }

  @Get('sonminsu-requests/bookmarks/:id/toggle')
  @ApiOperation({
    summary: '의뢰 북마크',
  })
  @ApiParam({
    name: 'id',
    required: true,
  })
  async toggleSonminsuRequestBookmark(
    @User('sub') userId: number,
    @Param('id') requestId: number,
  ) {
    await this.sonminsuRequestBookmarkService.changeSonminsuRequestBookmarkStatus(
      { userId, requestId },
    );
  }

  // @Get('follows')
  // async getFollows() {}

  // @Get('followers')
  // async getFollowers() {}

  // @Put('follows/toggle/:id')
  // async toggleFollow() {}
}
