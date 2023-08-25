import { Module } from '@nestjs/common';
import { FandomService } from './fandom.service';
import { FandomController } from './fandom.controller';
import { S3Module } from '@s3';

@Module({
  imports: [S3Module],
  providers: [FandomService],
  controllers: [FandomController],
  exports: [FandomService],
})
export class FandomModule {}
