import { SonminsuItemEntity } from '@entities';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateSonminsuItemDto extends PickType(SonminsuItemEntity, [
  'originUrl',
] as const) {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  originUrl: string;
}
