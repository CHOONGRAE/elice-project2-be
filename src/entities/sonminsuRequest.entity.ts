import { SonminsuRequests } from '@prisma/client';

export class SonminsuRequestEntity implements SonminsuRequests {
  id: number;
  userId: number;
  title: string;
  content: string;
  done: boolean;
  createdAt: Date;
}
