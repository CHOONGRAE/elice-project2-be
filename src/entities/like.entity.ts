import { Likes } from '@prisma/client';

export class LikeEntity implements Likes {
  userId: number;
  feedId: number;
}
