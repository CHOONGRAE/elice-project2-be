import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginateFeedDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsNumber()
  page: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsNumber()
  perPage: number;
}
