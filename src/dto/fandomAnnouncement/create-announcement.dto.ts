import { FandomAnnouncementEntity } from '@entities';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateFandomAnnouncementDto extends OmitType(
  FandomAnnouncementEntity,
  ['id', 'userId', 'createdAt', 'deletedAt'],
) {
  @IsNumber()
  @ApiProperty()
  fandomId: number;

  @IsString()
  @ApiProperty()
  content: string;
}
