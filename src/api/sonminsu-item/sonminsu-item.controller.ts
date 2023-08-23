import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SonminsuItemService } from './sonminsu-item.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateSonminsuItemDto } from '@dto/sonminsuItemDto/create-sonminsuItem.dto';
import { AuthGuard } from '@guards/auth.guard';
import { UpdateSonminsuItemDto } from '@dto/sonminsuItemDto/update-sonminsuItem.dto';
import { PaginateSonminsuItemDto } from '@dto/sonminsuItemDto/paginate-sonminsuItem.dto';

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

  @Post()
  @UseGuards(AuthGuard)
  async createSonminsuItem(
    @Body() createSonminsuItemDto: CreateSonminsuItemDto,
  ) {
    return await this.sonminsuItemService.createSonminsuItem(
      createSonminsuItemDto,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'id',
  })
  async updateSonminsuItem(
    @Param('id') id: number,
    updateSonminsuItemDto: UpdateSonminsuItemDto,
  ) {
    return await this.sonminsuItemService.updateSonminsuItem(
      id,
      updateSonminsuItemDto,
    );
  }
}
