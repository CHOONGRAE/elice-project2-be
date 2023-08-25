import { Controller, Get, Query } from '@nestjs/common';
import { SonminsuItemService } from './sonminsu-item.service';
import { PaginateSonminsuItemDto } from '@dto/sonminsuItemDto/paginate-sonminsuItem.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'sonminsu-items',
  version: '1',
})
@ApiTags('SonminsuItem API')
export class SonminsuItemController {
  constructor(private readonly sonminsuItemService: SonminsuItemService) {}

  @Get()
  async getSonminsuItems(@Query() pagination: PaginateSonminsuItemDto) {
    return await this.sonminsuItemService.getSonminsuItems(pagination);
  }
}
