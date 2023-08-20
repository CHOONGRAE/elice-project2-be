import { Messages } from '@prisma/client';

export class MessageEntity implements Messages {
  id: number;
  fandomId: number;
  userId: number;
  content: string;
  createdAt: Date;
  deletedAt: Date;
}
