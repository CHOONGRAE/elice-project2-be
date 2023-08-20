import { SonminsuRequestImages } from '@prisma/client';

export class SonminsuRequestImageEntity implements SonminsuRequestImages {
  id: number;
  requestId: number;
  url: string;
}
