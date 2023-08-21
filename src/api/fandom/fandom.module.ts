import { Module } from '@nestjs/common';
import { FandomService } from './fandom.service';
import { FandomController } from './fandom.controller';

@Module({
  providers: [FandomService],
  controllers: [FandomController],
  exports: [FandomService],
})
export class FandomModule {}
