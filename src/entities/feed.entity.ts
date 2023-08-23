import { Feeds } from '@prisma/client';

export class FeedEntity implements Feeds {
  id: number;
  userId: number;
  fandomId: number;
  content: string;
  groupName: string;
  artistName: string;
  createdAt: Date;
  deletedAt: Date;
}
