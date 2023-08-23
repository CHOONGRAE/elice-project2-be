import { MessageFiles } from '@prisma/client';

export class MessageFileEntity implements MessageFiles {
  id: number;
  messageId: number;
  url: string;
  createdAt: Date;
  deletedAt: Date;
}
