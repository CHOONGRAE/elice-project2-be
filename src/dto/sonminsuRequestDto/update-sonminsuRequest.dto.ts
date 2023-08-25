import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSonminsuRequestDto } from './create-sonminsuRequest.dto';
import { IsString } from 'class-validator';

export class UpdateSonminsuRequestDto extends PartialType(
  CreateSonminsuRequestDto,
) {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsString()
  @ApiProperty()
  groupName: string;

  @IsString()
  @ApiProperty()
  artistName: string;

  @IsString()
  image: Express.Multer.File;
}
