import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';

@Module({
  providers: [FollowService],
  exports: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
