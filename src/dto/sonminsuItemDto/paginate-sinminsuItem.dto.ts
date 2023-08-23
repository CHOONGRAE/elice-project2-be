import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, min } from 'class-validator';

export class PaginateSonminsuItemDto {
  @ApiProperty({ default: 1, required: false })
  @IsNumber()
  page: number;

  @ApiProperty({ default: 10, required: false })
  @IsNumber()
  perPage: number;
}
