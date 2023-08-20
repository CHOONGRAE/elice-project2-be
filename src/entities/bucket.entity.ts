import { Buckets } from '@prisma/client';

export class BucketEntity implements Buckets {
  id: number;
  userId: number;
  bucketName: string;
  createdAt: Date;
}
