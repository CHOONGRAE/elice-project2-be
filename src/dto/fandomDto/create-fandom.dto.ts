import { FandomEntity } from '@entities';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFandomDto extends PartialType(FandomEntity) {
  @IsString()
  @ApiProperty()
  fandomName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
