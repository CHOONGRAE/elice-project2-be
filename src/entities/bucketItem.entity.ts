import { BucketItems } from '@prisma/client';

export class BucketItemEntity implements BucketItems {
  bucketId: number;
  itemId: number;
}
