import { BucketItemService } from '@api/bucket-item/bucket-item.service';
import { SonminsuItemService } from '@api/sonminsu-item/sonminsu-item.service';
import { User } from '@decorator/User.decorator';
import { CreateSonminsuItemDto } from '@dto/sonminsuItemDto/create-sonminsuItem.dto';
import { PaginateSonminsuItemDto } from '@dto/sonminsuItemDto/paginate-sonminsuItem.dto';
import { AuthGuard } from '@guards/auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'users/sonminsu-items',
  version: '1',
})
@ApiTags('Users / SonminsuItems API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserSonminsuItemController {
  constructor(
    private readonly sonminsuItemService: SonminsuItemService,
    private readonly bucketItemService: BucketItemService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '손민수 아이템 목록 (버킷에 담겻는지 정보 O)',
  })
  async get(@User() userId: number, @Query() test: PaginateSonminsuItemDto) {
    return this.sonminsuItemService.getSonminsuItemsByUser(userId, test);
  }

  @Post()
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

  @Put(':itemId/buckets/:bucketId')
  @ApiOperation({
    summary: '버킷에 아이템 담기',
  })
  async toggleBucketItem(
    @Param('bucketId') bucketId: number,
    @Param('itemId') itemId: number,
  ) {
    await this.bucketItemService.changeBucketItemStatus({ bucketId, itemId });
  }
}
