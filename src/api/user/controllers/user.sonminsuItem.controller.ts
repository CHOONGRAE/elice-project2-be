import { BucketItemService } from '@api/bucket-item/bucket-item.service';
import { SonminsuItemService } from '@api/sonminsu-item/sonminsu-item.service';
import { CreateSonminsuItemDto } from '@dto/sonminsuItemDto/create-sonminsuItem.dto';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
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
