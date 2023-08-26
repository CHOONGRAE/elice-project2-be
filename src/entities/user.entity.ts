import { Users } from '@prisma/client';

export class UserEntity implements Users {
  id: number;
  authId: number;
  nickName: string;
  introduction: string;
  image: string;
  createdAt: Date;
  deletedAt: Date;
}
