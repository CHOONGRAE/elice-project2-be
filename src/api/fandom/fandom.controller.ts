import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FandomService } from './fandom.service';
import { PaginateFandomDto } from '@dto/fandomDto/paginate-fandom.dto';

@Controller({
  path: 'fandoms',
  version: '1',
})
@ApiTags('Fandoms API')
export class FandomController {
  constructor(private readonly fandomService: FandomService) {}

  @Get()
  @ApiOperation({
    summary: '팬덤 리스트',
  })
  async getFandoms(@Query() paginateFandomDto: PaginateFandomDto) {
    return await this.fandomService.getFandoms(paginateFandomDto);
  }

  @Get('hot')
  @ApiOperation({
    summary: '핫4 팬덤',
  })
  async getHotFandoms() {
    return await this.fandomService.getHotFandoms();
  }
}
