import { SonminsuRequestBookmarks } from '@prisma/client';

export class SonminsuRequestBookmarkEntity implements SonminsuRequestBookmarks {
  userId: number;
  requestId: number;
}
