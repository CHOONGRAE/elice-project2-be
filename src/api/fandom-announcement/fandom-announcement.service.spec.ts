import { Test, TestingModule } from '@nestjs/testing';
import { FandomAnnouncementService } from './fandom-announcement.service';

describe('FandomAnnouncementService', () => {
  let service: FandomAnnouncementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FandomAnnouncementService],
    }).compile();

    service = module.get<FandomAnnouncementService>(FandomAnnouncementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
