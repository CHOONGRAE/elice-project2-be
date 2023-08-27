import { BucketItemEntity } from '@entities';
import { IsNumber } from 'class-validator';

export class BucketItemDto extends BucketItemEntity {
  @IsNumber()
  bucketId: number;

  @IsNumber()
  itemId: number;
}
