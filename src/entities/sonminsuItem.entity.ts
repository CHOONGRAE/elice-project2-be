import { SonminsuItems } from '@prisma/client';

export class SonminsuItemEntity implements SonminsuItems {
  id: number;
  feedId: number;
  answerId: number;
  originUrl: string;
  imgUrl: string;
  title: string;
  price: string;
  groupName: string;
  artistName: string;
  registration: boolean;
  createdAt: Date;
}
