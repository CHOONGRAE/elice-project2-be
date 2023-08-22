import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FandomService } from './fandom.service';

@Controller({
  path: 'fandoms',
  version: '1',
})
@ApiTags('Fandoms API')
export class FandomController {
  constructor(private readonly fandomService: FandomService) {}

  @Get('hot')
  async getHotFandoms() {
    return await this.fandomService.getHotFandoms();
  }
}
