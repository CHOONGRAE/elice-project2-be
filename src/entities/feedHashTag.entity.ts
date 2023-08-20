import { FeedHashTags } from '@prisma/client';

export class FeedHashTagEntity implements FeedHashTags {
  feedId: number;
  hashTagId: number;
}
