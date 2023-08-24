import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFandomAnnouncementDto } from './create-announcement.dto';
import { IsString } from 'class-validator';

export class UpdateFandomAnnouncementDto extends PartialType(
  CreateFandomAnnouncementDto,
) {
  @IsString()
  @ApiProperty()
  content: string;
}
