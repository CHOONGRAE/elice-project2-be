import { Users } from '@prisma/client';

export class UserEntity implements Users {
  id: number;
  authId: number;
  userName: string;
  nickName: string;
  introduction: string;
  profileImgUrl: string;
  birthDate: string;
  phoneNumber: string;
  createdAt: Date;
  deletedAt: Date;
}
