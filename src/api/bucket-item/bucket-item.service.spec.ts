import { Test, TestingModule } from '@nestjs/testing';
import { BucketItemService } from './bucket-item.service';

describe('BucketItemService', () => {
  let service: BucketItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BucketItemService],
    }).compile();

    service = module.get<BucketItemService>(BucketItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
