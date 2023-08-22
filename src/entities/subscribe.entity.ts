import { Subscribes } from '@prisma/client';

export class SubscribeEntity implements Subscribes {
  userId: number;
  fandomId: number;
}
