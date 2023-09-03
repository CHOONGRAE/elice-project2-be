import { Test, TestingModule } from '@nestjs/testing';
import { AuthKakaoService } from './auth.kakao.service';

describe('AuthKakaoService', () => {
  let service: AuthKakaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthKakaoService],
    }).compile();

    service = module.get<AuthKakaoService>(AuthKakaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
