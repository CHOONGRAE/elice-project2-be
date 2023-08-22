import { Auth } from '@prisma/client';

export class AuthEntity implements Auth {
  id: number;
  email: string;
  password: string;
}