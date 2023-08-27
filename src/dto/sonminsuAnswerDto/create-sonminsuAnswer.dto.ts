import { SonminsuAnswerEntity } from '@entities';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CreateSonminsuAnswerDto extends PartialType(SonminsuAnswerEntity) {
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ type: 'array', items: { type: 'number' }, default: [] })
  itemIds: number[];
}
