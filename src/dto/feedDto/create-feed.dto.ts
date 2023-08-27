import { FeedEntity } from '@entities';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  isArray,
} from 'class-validator';

export class CreateFeedDto extends OmitType(FeedEntity, [
  'id',
  'userId',
  'createdAt',
  'deletedAt',
] as const) {
  @IsNumber()
  @ApiProperty()
  fandomId: number;

  @IsString()
  @ApiProperty()
  content: string;

  @IsString()
  @ApiProperty()
  groupName: string;

  @IsString()
  @ApiProperty()
  artistName: string;

  @IsOptional()
  @Transform(({ value }) => (isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  hashTags: string[];

  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;

  @IsOptional()
  @Transform(({ value }) => (isArray(value) ? value : [value]))
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ type: 'array', items: { type: 'number' }, required: false })
  sonminsuItems: number[];
}
