import { Fandoms } from '@prisma/client';

export class FandomEntity implements Fandoms {
  id: number;
  userId: number;
  fandomName: string;
  thumbnailImgUrl: string;
  createdAt: Date;
}
