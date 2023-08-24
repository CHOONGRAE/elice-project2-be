import { Module } from '@nestjs/common';
import { SonminsuRequestService } from './sonminsu-request.service';
import { SonminsuRequestController } from './sonminsu-request.controller';
import { S3Module } from '@s3';

@Module({
  imports: [S3Module],
  providers: [SonminsuRequestService],
  controllers: [SonminsuRequestController],
  exports: [SonminsuRequestService],
})
export class SonminsuRequestModule {}
