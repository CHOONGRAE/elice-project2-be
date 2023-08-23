import { Module } from '@nestjs/common';
import { HashTagService } from './hash-tag.service';

@Module({
  providers: [HashTagService],
  exports: [HashTagService],
})
export class HashTagModule {}
