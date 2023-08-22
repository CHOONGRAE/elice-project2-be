import { FandomEntity } from '@entities';
import { OmitType } from '@nestjs/swagger';

export class CreateFandomDto extends OmitType(FandomEntity, [
  'id',
  'createdAt',
]) {
  userId: number;
  fandomName: string;
  thumbnailImgUrl: string;
}
