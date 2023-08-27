import { Test, TestingModule } from '@nestjs/testing';
import { FandomAnnouncementController } from './fandom-announcement.controller';

describe('FandomAnnouncementController', () => {
  let controller: FandomAnnouncementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FandomAnnouncementController],
    }).compile();

    controller = module.get<FandomAnnouncementController>(FandomAnnouncementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
