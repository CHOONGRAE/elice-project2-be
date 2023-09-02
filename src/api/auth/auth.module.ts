import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { S3Module } from '@s3';
import { AuthKakaoService } from './kakao/auth.kakao.service';
import { AuthGoogleService } from './google/auth.google.service';

@Module({
  imports: [S3Module],
  controllers: [AuthController],
  providers: [AuthService, AuthKakaoService, AuthGoogleService],
})
export class AuthModule {}
