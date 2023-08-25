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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FandomService } from '@api/fandom/fandom.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFandomDto } from '@dto/fandomDto/create-fandom.dto';
import { UpdateFandomDto } from '@dto/fandomDto/update-fandom.dto';
import { User } from '@decorator/User.decorator';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users API')
// @UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fandomService: FandomService,
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
    @User('id') userId: number,
    @Body() createFandomDto: CreateFandomDto,
  ) {
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
  async deleteFandom() {}

  @Get('feeds')
  async getFeeds() {}

  @Post('feeds')
  async createFeed() {}

  @Get('feeds/my')
  async getMyFeeds() {}

  @Patch('feeds/:id')
  async updateFeed() {}

  @Delete('feeds/:id')
  async deleteFeed() {}

  @Get('sonminsu-requests')
  async getSonminsuRequests() {}

  @Get('sonminsu-requests/done')
  async getSonminsuRequestsDone() {}

  @Get('sonminsu-requests/bookmarks')
  async getSonminsuRequestBookmarks() {}

  @Get('sonminsu-requests/bookmarks/toggle/:id')
  async toggleSonminsuRequestBookmark() {}

  @Get('follows')
  async getFollows() {}

  @Get('followers')
  async getFollowers() {}

  @Put('follows/toggle/:id')
  async toggleFollow() {}
}
