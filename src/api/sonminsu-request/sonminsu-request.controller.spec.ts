import { Test, TestingModule } from '@nestjs/testing';
import { SonminsuRequestController } from './sonminsu-request.controller';

describe('SonminsuRequestController', () => {
  let controller: SonminsuRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SonminsuRequestController],
    }).compile();

    controller = module.get<SonminsuRequestController>(SonminsuRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
