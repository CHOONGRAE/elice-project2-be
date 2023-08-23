import { PartialType } from '@nestjs/swagger';
import { CreateFeedDto } from './create-feed.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateFeedDto extends PartialType(CreateFeedDto) {
  @IsNumber()
  feedId: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map(String))
  hashTags?: string[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  sonminsuItems?: number[];
}
