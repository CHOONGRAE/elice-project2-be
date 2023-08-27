import { Controller, Get, Param, Query } from '@nestjs/common';
import { SonminsuRequestService } from './sonminsu-request.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetSonminsuRequestDto } from '@dto/sonminsuRequestDto/get-sonmisuRequest.dto';

@Controller({
  path: 'sonminsu-requests',
  version: '1',
})
@ApiTags('SonminsuRequest Api')
export class SonminsuRequestController {
  constructor(
    private readonly sonminsuRequestService: SonminsuRequestService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '손민수 의뢰 목록',
  })
  async getSonminsuRequests(
    @Query() getSonminsuRequestDto: GetSonminsuRequestDto,
  ) {
    return await this.sonminsuRequestService.getSonminsuRequests(
      getSonminsuRequestDto,
    );
  }

  @Get(':requestId')
  @ApiOperation({
    summary: '손민수 의뢰 상세',
  })
  async getSominsuRequest(@Param('requestId') id: number) {
    return await this.sonminsuRequestService.getSonminsuRequest(id);
  }
}
