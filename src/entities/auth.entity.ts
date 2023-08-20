import { Auth as AuthModel } from '@prisma/client';

export class AuthEntity implements AuthModel {
  id: number;
  email: string;
  password: string;
}
