import { FeedEntity } from '@entities';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map(String))
  @ApiProperty()
  hashTags: string[];

  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;

  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  @ApiProperty()
  sonminsuItems: number[];
}
