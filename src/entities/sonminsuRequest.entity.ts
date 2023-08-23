import { SonminsuRequests } from '@prisma/client';

export class SonminsuRequestEntity implements SonminsuRequests {
  id: number;
  userId: number;
  title: string;
  content: string;
  groupName: string;
  artistName: string;
  isDone: boolean;
  createdAt: Date;
  deletedAt: Date;
}
