import { SonminsuAnswers } from '@prisma/client';

export class SonminsuAnswerEntity implements SonminsuAnswers {
  id: number;
  userId: number;
  requestId: number;
  content: string;
  isChoosed: boolean;
  createdAt: Date;
  deletedAt: Date;
}
