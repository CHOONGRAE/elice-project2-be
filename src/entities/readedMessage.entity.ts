import { ReadedMessages } from '@prisma/client';

export class ReadedMessageEntity implements ReadedMessages {
  userId: number;
  fandomId: number;
  messageId: number;
  uponJoiningMessageId: number;
}
