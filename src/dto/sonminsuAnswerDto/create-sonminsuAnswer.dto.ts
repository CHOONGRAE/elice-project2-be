import { SonminsuAnswerEntity } from '@entities';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CreateSonminsuAnswerDto extends PartialType(SonminsuAnswerEntity) {
  @IsNumber()
  @ApiProperty()
  requestId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty()
  itemIds: number[];

  content?: string;
}
