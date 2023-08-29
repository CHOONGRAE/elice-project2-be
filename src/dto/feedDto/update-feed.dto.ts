import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateFeedDto } from './create-feed.dto';

export class UpdateFeedDto extends OmitType(PartialType(CreateFeedDto), [
  'fandomId',
  'image',
  'groupName',
  'artistName',
  'sonminsuItems',
] as const) {
  @ApiProperty({ required: false, type: 'string' })
  content: string;

  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  hashTags: string[];
}
