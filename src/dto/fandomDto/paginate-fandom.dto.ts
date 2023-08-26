import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginateFandomDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  page: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  perPage: number;
}
