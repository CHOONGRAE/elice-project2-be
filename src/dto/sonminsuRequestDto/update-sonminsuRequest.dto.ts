import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateSonminsuRequestDto } from './create-sonminsuRequest.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSonminsuRequestDto extends OmitType(
  CreateSonminsuRequestDto,
  ['artistName', 'groupName', 'image'] as const,
) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false, type: 'string' })
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false, type: 'string' })
  content: string;
}
