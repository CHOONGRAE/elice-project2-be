import { FeedService } from '@api/feed/feed.service';
import { FollowService } from '@api/follow/follow.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly feed: FeedService,
    private readonly follow: FollowService,
  ) {}

  async getFesFosFos(userId) {}
}
