import { SubscribeEntity } from '@entities';
import { IsNumber } from 'class-validator';

export class SubscribeDto extends SubscribeEntity {
  @IsNumber()
  userId: number;

  @IsNumber()
  fandomId: number;
}
