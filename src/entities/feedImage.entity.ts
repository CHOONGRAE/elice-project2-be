import { FeedImages } from '@prisma/client';

export class FeedImageEntity implements FeedImages {
  id: number;
  feedId: number;
  url: string;
}
