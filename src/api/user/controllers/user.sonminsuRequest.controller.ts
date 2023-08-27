import { SonminsuRequestBookmarkService } from '@api/sonminsu-request-bookmark/sonminsu-request-bookmark.service';
import { SonminsuRequestService } from '@api/sonminsu-request/sonminsu-request.service';
import { User } from '@decorator/User.decorator';
import { CreateSonminsuRequestDto } from '@dto/sonminsuRequestDto/create-sonminsuRequest.dto';
import { GetSonminsuRequestDto } from '@dto/sonminsuRequestDto/get-sonmisuRequest.dto';
import { PaginateSonminsuRequestDto } from '@dto/sonminsuRequestDto/paginate-sonminsuRequest.dto';
import { UpdateSonminsuRequestDto } from '@dto/sonminsuRequestDto/update-sonminsuRequest.dto';
import { AuthGuard } from '@guards/auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
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
  path: 'users/sonminsu-requests',
  version: '1',
})
@ApiTags('Users / SonminsuRequests API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserSonminsuRequsetsController {
  constructor(
    private readonly sonminsuRequestService: SonminsuRequestService,
    private readonly sonminsuRequestBookmarkService: SonminsuRequestBookmarkService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '본인이 의뢰한 목록',
  })
  async getSonminsuRequests(
    @User() userId: number,
    @Query() getSonminsuRequestDto: GetSonminsuRequestDto,
  ) {
    return await this.sonminsuRequestService.getSonminsuRequestsByUser(
      userId,
      getSonminsuRequestDto,
    );
  }

  @Post()
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
    return await this.sonminsuRequestService.createSonminsuRequest(userId, {
      ...createSonminsuRequestDto,
      image,
    });
  }

  @Get('bookmarks')
  @ApiOperation({
    summary: '본인이 찜한 의뢰 목록',
  })
  async getSonminsuRequestBookmarks(
    @User() userId: number,
    @Query() paginateSonminsuRequestDto: PaginateSonminsuRequestDto,
  ) {
    return await this.sonminsuRequestService.getSonminsuRequestsByBookmark(
      userId,
      paginateSonminsuRequestDto,
    );
  }

  @Patch(':requestId')
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
    return await this.sonminsuRequestService.updateSonminsuRequest(
      requestId,
      userId,
      { ...updateSonminsuRequestDto, image },
    );
  }

  @Put(':requestId/bookmarks')
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
}
