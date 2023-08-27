import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @Get('search')
  @ApiOperation({
    summary: '팬덤 검색',
  })
  async getFandomsBySearch(@Query('search') search: string) {
    return await this.fandomService.getFandomsBySearch(search);
  }

  @Get(':fandomId')
  @ApiOperation({
    summary: '팬덤 단일',
  })
  async getFandomById(@Param('fandomId') fandomId: number) {
    return await this.fandomService.getFandomById(fandomId);
  }
}
