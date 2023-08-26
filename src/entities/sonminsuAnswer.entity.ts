import { SonminsuAnswers } from '@prisma/client';

export class SonminsuAnswerEntity implements SonminsuAnswers {
  id: number;
  userId: number;
  requestId: number;
  isChoosed: boolean;
  createdAt: Date;
  deletedAt: Date;
}
