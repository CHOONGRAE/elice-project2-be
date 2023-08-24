import { Module } from '@nestjs/common';
import { SonminsuRequestService } from './sonminsu-request.service';
import { SonminsuRequestController } from './sonminsu-request.controller';

@Module({
  providers: [SonminsuRequestService],
  controllers: [SonminsuRequestController],
  exports: [SonminsuRequestService],
})
export class SonminsuRequestModule {}
