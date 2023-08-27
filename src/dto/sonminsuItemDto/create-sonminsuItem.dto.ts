import { SonminsuItemEntity } from '@entities';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSonminsuItemDto extends PickType(SonminsuItemEntity, [
  'originUrl',
  'groupName',
  'artistName',
] as const) {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  originUrl: string;

  @IsString()
  @ApiProperty()
  groupName: string;

  @IsString()
  @ApiProperty()
  artistName: string;
}
