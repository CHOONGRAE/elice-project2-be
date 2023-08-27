import { BucketEntity } from '@entities';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBucketDto extends PartialType(BucketEntity) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  bucketName: string;
}
