import { SonminsuRequestBookmarkEntity } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SonminsuRequestBookmarkDto extends SonminsuRequestBookmarkEntity {
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsNumber()
  @ApiProperty()
  requestId: number;
}
