import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OauthDto } from '@dto/authDto/oauth.dto';
import { OauthService } from '../oauth.service';

@Injectable()
export class AuthKakaoService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly Oauth: OauthService,
  ) {}

  async signInKakao(data: OauthDto) {
    const { code, domain } = data;

    const KAKAO_KEY = this.config.get('KAKAO_KEY');
    const KAKAO_SECRET = this.config.get('KAKAO_SECRET');
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';

    const body = {
      grant_type: 'authorization_code',
      client_id: KAKAO_KEY,
      redirect_uri: `${domain}/login/kakao-callback`,
      code,
      client_secret: KAKAO_SECRET,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const res = await axios.post(kakaoTokenUrl, body, { headers });

      const { id_token } = res.data;

      const payload = this.jwt.decode(id_token) as {
        nickname: string;
        picture: string;
        email: string;
        sub: string;
      };

      const { nickname: name, picture, email, sub } = payload;

      return await this.Oauth.getOrCreateAuth({
        sub,
        email,
        name,
        picture,
        provider: 'kakao',
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
