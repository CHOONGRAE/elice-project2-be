import { FollowEntity } from '@entities';

export class FollowDto extends FollowEntity {
  userId: number;

  followId: number;
}
