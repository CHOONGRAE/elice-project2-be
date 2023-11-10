import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { S3Module } from '@s3';
import { OauthController } from './oauth/oauth.controller';
import { AuthKakaoService } from './oauth/kakao/auth.kakao.service';
import { AuthGoogleService } from './oauth/google/auth.google.service';
import { OauthService } from './oauth/oauth.service';

@Module({
  imports: [S3Module],
  controllers: [AuthController, OauthController],
  providers: [AuthService, OauthService, AuthKakaoService, AuthGoogleService],
})
export class AuthModule {}
