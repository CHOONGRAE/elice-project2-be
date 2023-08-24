import { BucketEntity } from '@entities';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBucketDto extends PartialType(BucketEntity) {
  @IsString()
  @ApiProperty()
  bucketName: string;
}
