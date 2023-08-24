import { Module } from '@nestjs/common';
import { BucketItemService } from './bucket-item.service';

@Module({
  providers: [BucketItemService],
  exports: [BucketItemService],
})
export class BucketItemModule {}
