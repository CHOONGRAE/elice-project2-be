import { Controller, Get, Param, Query } from '@nestjs/common';
import { SonminsuItemService } from './sonminsu-item.service';
import { PaginateSonminsuItemDto } from '@dto/sonminsuItemDto/paginate-sonminsuItem.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchSonminsuItemDto } from '@dto/sonminsuItemDto/search-sonminsuItem.dto';

@Controller({
  path: 'sonminsu-items',
  version: '1',
})
@ApiTags('SonminsuItem API')
export class SonminsuItemController {
  constructor(private readonly sonminsuItemService: SonminsuItemService) {}

  @Get()
  @ApiOperation({
    summary: '손민수 아이템 목록',
  })
  async getSonminsuItems(@Query() pagination: PaginateSonminsuItemDto) {
    return await this.sonminsuItemService.getSonminsuItems(pagination);
  }

  @Get('search')
  @ApiOperation({
    summary: '손민수 아이템 검색',
  })
  async getSonminsuItemsBySearch(
    @Query() searchSonminsuItemDto: SearchSonminsuItemDto,
  ) {
    return await this.sonminsuItemService.getSonminsuItemsBySearch(
      searchSonminsuItemDto,
    );
  }

  @Get(':itemId')
  @ApiOperation({
    summary: '손민수 아이템 상세',
  })
  async getSonminsuItemById(@Param('itemId') id: number) {
    return await this.sonminsuItemService.getSonminsuItemById(id);
  }
}
