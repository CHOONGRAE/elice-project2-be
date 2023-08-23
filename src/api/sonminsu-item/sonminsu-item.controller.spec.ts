import { Test, TestingModule } from '@nestjs/testing';
import { SonminsuItemController } from './sonminsu-item.controller';

describe('SonminsuItemController', () => {
  let controller: SonminsuItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SonminsuItemController],
    }).compile();

    controller = module.get<SonminsuItemController>(SonminsuItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
