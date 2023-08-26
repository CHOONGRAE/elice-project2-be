import { FandomEntity } from '@entities';
import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFandomDto extends PartialType(FandomEntity) {
  @IsOptional()
  @IsNumber()
  @ApiHideProperty()
  userId: number;

  @IsString()
  @ApiProperty()
  fandomName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
