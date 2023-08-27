import { Test, TestingModule } from '@nestjs/testing';
import { SonminsuAnswerService } from './sonminsu-answer.service';

describe('SonminsuAnswerService', () => {
  let service: SonminsuAnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SonminsuAnswerService],
    }).compile();

    service = module.get<SonminsuAnswerService>(SonminsuAnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
