import { SonminsuItemEntity } from '@entities';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateSonminsuItemDto extends PartialType(
  OmitType(SonminsuItemEntity, ['id'] as const),
) {
  feedId?: number;
  registration?: boolean;
  createdAt?: Date;
}
