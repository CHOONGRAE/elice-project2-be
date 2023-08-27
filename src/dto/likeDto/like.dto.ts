import { LikeEntity } from '@entities';
import { IsNumber } from 'class-validator';

export class LikeDto extends LikeEntity {
  @IsNumber()
  userId: number;

  @IsNumber()
  feedId: number;
}
