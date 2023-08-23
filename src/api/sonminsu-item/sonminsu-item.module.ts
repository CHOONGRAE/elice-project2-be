import { Module } from '@nestjs/common';
import { SonminsuItemService } from './sonminsu-item.service';
import { SonminsuItemController } from './sonminsu-item.controller';
import { ScraperModule } from '@scraper';

@Module({
  imports: [ScraperModule],
  providers: [SonminsuItemService],
  controllers: [SonminsuItemController],
})
export class SonminsuItemModule {}
