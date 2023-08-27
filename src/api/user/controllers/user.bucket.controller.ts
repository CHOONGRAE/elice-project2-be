import { BucketService } from '@api/bucket/bucket.service';
import { User } from '@decorator/User.decorator';
import { CreateBucketDto } from '@dto/bucketDto/create-bucket.dto';
import { AuthGuard } from '@guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'users/buckets',
  version: '1',
})
@ApiTags('Users / Buckets API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserBuckerController {
  constructor(private readonly bucketService: BucketService) {}

  @Get()
  @ApiOperation({
    summary: '버킷 목록',
  })
  async getBuckets(@User() userId: number) {
    return await this.bucketService.getBuckets(userId);
  }

  @Get(':bucketId')
  @ApiOperation({
    summary: '버킷 상세',
  })
  async getBucketById(@User() userId: number, @Param('bucketId') id: number) {
    return await this.bucketService.getBucket(id, userId);
  }

  @Post()
  @ApiOperation({
    summary: '버킷 생성',
  })
  async createBucket(
    @User() userId: number,
    @Body() createBucketDto: CreateBucketDto,
  ) {
    return await this.bucketService.createBucket(userId, createBucketDto);
  }

  @Delete(':bucketId')
  @ApiOperation({
    summary: '버킷 삭제',
  })
  async deleteBucket(@Param('bucketId') id: number, @User() userId: number) {
    await this.bucketService.deleteBucket(id, userId);
  }
}
