import { Module } from '@nestjs/common';
import { SonminsuAnswerService } from './sonminsu-answer.service';

@Module({
  providers: [SonminsuAnswerService],
  exports: [SonminsuAnswerService],
})
export class SonminsuAnswerModule {}
