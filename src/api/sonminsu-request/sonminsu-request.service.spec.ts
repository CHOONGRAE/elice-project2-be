import { Test, TestingModule } from '@nestjs/testing';
import { SonminsuRequestService } from './sonminsu-request.service';

describe('SonminsuRequestService', () => {
  let service: SonminsuRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SonminsuRequestService],
    }).compile();

    service = module.get<SonminsuRequestService>(SonminsuRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
