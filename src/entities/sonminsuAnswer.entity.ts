import { SonminsuAnswers } from '@prisma/client';

export class SonminsuAnswerEntity implements SonminsuAnswers {
  id: number;
  userId: number;
  requestId: number;
  content: string;
  choosed: boolean;
  createdAt: Date;
}
