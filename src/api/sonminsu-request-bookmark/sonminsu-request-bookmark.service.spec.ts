import { Test, TestingModule } from '@nestjs/testing';
import { SonminsuRequestBookmarkService } from './sonminsu-request-bookmark.service';

describe('SonminsuRequestBookmarkService', () => {
  let service: SonminsuRequestBookmarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SonminsuRequestBookmarkService],
    }).compile();

    service = module.get<SonminsuRequestBookmarkService>(SonminsuRequestBookmarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
