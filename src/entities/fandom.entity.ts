import { Fandoms } from '@prisma/client';

export class FandomEntity implements Fandoms {
  id: number;
  userId: number;
  fandomName: string;
  image: string;
  createdAt: Date;
  deletedAt: Date;
}
