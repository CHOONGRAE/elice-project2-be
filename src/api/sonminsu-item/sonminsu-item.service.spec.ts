import { Test, TestingModule } from '@nestjs/testing';
import { SonminsuItemService } from './sonminsu-item.service';

describe('SonminsuItemService', () => {
  let service: SonminsuItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SonminsuItemService],
    }).compile();

    service = module.get<SonminsuItemService>(SonminsuItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
