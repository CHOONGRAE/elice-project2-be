import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateSonminsuItemDto } from './paginate-sonminsuItem.dto';

export class SearchSonminsuItemDto extends PaginateSonminsuItemDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search: string;
}
