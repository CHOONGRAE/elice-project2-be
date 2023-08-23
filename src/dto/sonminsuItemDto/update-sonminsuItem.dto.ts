import { SonminsuItemEntity } from '@entities';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateSonminsuItemDto extends PartialType(
  OmitType(SonminsuItemEntity, ['id', 'createdAt'] as const),
) {
  feedId?: number;
  answerId?: number;
  originUrl?: string;
  imgUrl?: string;
  title?: string;
  price?: string;
  registration?: boolean;
}
