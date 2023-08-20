import { Follows } from '@prisma/client';

export class FollowEntity implements Follows {
  userId: number;
  followId: number;
}
