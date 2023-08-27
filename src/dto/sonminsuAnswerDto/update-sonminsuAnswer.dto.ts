import { ApiProperty } from '@nestjs/swagger';
import { CreateSonminsuAnswerDto } from './create-sonminsuAnswer.dto';
import { IsArray, IsNumber } from 'class-validator';

export class UpdateSonminsuAnswerDto extends CreateSonminsuAnswerDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty()
  itemIds: number[];
}
