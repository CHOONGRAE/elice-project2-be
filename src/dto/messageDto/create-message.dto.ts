import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsNumber()
  fandomId: number;
}
