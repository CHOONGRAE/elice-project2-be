import { Controller, Get, Query } from '@nestjs/common';
import { SonminsuRequestService } from './sonminsu-request.service';
import { ApiTags } from '@nestjs/swagger';
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
  async getSonminsuRequestsDoing(
    @Query() getSonminsuRequestDto: GetSonminsuRequestDto,
  ) {
    return await this.sonminsuRequestService.getSonminsuRequests(
      getSonminsuRequestDto,
    );
  }
}
