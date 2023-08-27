import { FandomService } from '@api/fandom/fandom.service';
import { SubscribeService } from '@api/subscribe/subscribe.service';
import { User } from '@decorator/User.decorator';
import { CreateFandomDto } from '@dto/fandomDto/create-fandom.dto';
import { PaginateFandomDto } from '@dto/fandomDto/paginate-fandom.dto';
import { UpdateFandomDto } from '@dto/fandomDto/update-fandom.dto';
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
  path: 'users/fandoms',
  version: '1',
})
@ApiTags('Users / Fandoms API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserFandomController {
  constructor(
    private readonly fandomService: FandomService,
    private readonly subscribeService: SubscribeService,
  ) {}
  @Get()
  @ApiOperation({
    summary: '가입한 팬덤 목록',
  })
  async getFandoms(
    @User() id: number,
    @Query() paginateFandomDto: PaginateFandomDto,
  ) {
    return await this.fandomService.getFandomsByUser(id, paginateFandomDto);
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

  @Patch(':fandomId')
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

  @Delete(':fandomId')
  @ApiOperation({
    summary: '팬덤 삭제',
  })
  async deleteFandom(@Param('fandomId') id: number, @User() userId: number) {
    await this.fandomService.deleteFandom({ id, userId });
  }

  @Put(':fandomId/subscribe')
  @ApiOperation({
    summary: '팬덤 구독 상태 변경',
  })
  async toggleFandomSubscribe(
    @User() userId: number,
    @Param('fandomId') fandomId: number,
  ) {
    await this.subscribeService.changeLikeStatus({ userId, fandomId });
  }
}
