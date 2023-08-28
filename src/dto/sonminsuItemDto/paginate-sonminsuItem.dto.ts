import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginateSonminsuItemDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: false })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false })
  perPage?: number = 10;
}
