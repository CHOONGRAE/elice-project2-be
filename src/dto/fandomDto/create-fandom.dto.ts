import { FandomEntity } from '@entities';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateFandomDto extends PartialType(FandomEntity) {
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsString()
  @ApiProperty()
  fandomName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
