import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSonminsuRequestDto } from './create-sonminsuRequest.dto';
import { IsString } from 'class-validator';

export class UpdateSonminsuRequestDto extends PartialType(
  CreateSonminsuRequestDto,
) {
  @IsString()
  @ApiProperty()
  content: string;
}
