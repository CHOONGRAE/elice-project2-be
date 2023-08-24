import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginateSonminsuRequestDto } from './paginate-sonminsuRequest.dto';
import { Transform } from 'class-transformer';

export class GetSonminsuRequestDto extends PaginateSonminsuRequestDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  @Transform(({ obj: { done } }) => done === 'true')
  done: boolean;
}
