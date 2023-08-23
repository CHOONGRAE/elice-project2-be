import { FeedEntity } from '@entities';
import { OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateFeedDto extends OmitType(FeedEntity, [
  'id',
  'userId',
  'createdAt',
  'deletedAt',
] as const) {
  @IsNumber()
  fandomId: number;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map(String))
  hashTags: string[];

  image: Express.Multer.File;

  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value.map(Number))
  sonminsuItems: number[];
}
