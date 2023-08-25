import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { FandomEntity } from '@entities';

export class UpdateFandomDto extends PartialType(FandomEntity) {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiHideProperty()
  id: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiHideProperty()
  userId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  fandomName?: string;

  //   @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: Express.Multer.File;
}
