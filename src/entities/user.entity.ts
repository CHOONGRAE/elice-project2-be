import { Users as UserModel } from '@prisma/client';

export class UserEntity implements UserModel {
  userId: number;
  userName: string;
  nickName: string;
  introduction: string;
  profileImgUrl: string;
  birthDate: string;
  phoneNumber: string;
  selectedAnswerCount: number;
  createdAt: Date;
}
