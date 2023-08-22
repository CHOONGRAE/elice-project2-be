import { FandomAnnouncements } from '@prisma/client';

export class FandomAnnouncementEntity implements FandomAnnouncements {
  id: number;
  fandomId: number;
  userId: number;
  content: string;
  createdAt: Date;
}
