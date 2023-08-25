import { FandomEntity } from '@entities';
import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateFandomDto extends PartialType(FandomEntity) {
  @IsNumber()
  @ApiHideProperty()
  userId: number;

  @IsString()
  @ApiProperty()
  fandomName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
