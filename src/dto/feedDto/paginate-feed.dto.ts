import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginateFeedDto {
  @ApiProperty({ default: 0, required: false })
  @IsNumber()
  page: number;

  @ApiProperty({ default: 10, required: false })
  @IsNumber()
  perPage: number;
}
