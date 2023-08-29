import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSonminsuRequestDto } from './create-sonminsuRequest.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSonminsuRequestDto extends PartialType(
  CreateSonminsuRequestDto,
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
