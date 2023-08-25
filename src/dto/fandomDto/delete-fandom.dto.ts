import { FandomEntity } from '@entities';
import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DeleteFandomDto extends PartialType(FandomEntity) {
  @IsNotEmpty()
  @IsNumber()
  @ApiHideProperty()
  id: number;

  @IsOptional()
  @IsNumber()
  userId: number;
}
