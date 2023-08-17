import { UserMeta as UserModel } from '@prisma/client';

export class UserEntity implements UserModel {
  userId: number;
  userName: string;
  birthDate: string;
  phoneNumber: string;
  selectedAnswerCount: number;
  createdAt: Date;
}
