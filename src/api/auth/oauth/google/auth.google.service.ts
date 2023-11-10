import { OauthDto } from '@dto/authDto/oauth.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { OauthService } from '../oauth.service';

@Injectable()
export class AuthGoogleService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly Oauth: OauthService,
  ) {}
  async signInGoogle(data: OauthDto) {
    const { code, domain } = data;

    const GOOGLE_CLIENT_ID = this.config.get('GOOGLE_CLIENT_ID');
    const GOOGLE_SECRET = this.config.get('GOOGLE_SECRET');
    const googleTokenUrl = 'https://oauth2.googleapis.com/token';

    const body = {
      grant_type: 'authorization_code',
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_SECRET,
      redirect_uri: `${domain}/login/google-callback`,
      code,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
      const res = await axios.post(googleTokenUrl, body, { headers });

      const { id_token } = res.data;

      const payload = this.jwt.decode(id_token) as {
        name: string;
        picture: string;
        email: string;
        sub: string;
      };

      const { name, picture, email, sub } = payload;

      return await this.Oauth.getOrCreateAuth({
        sub,
        email,
        name,
        picture,
        provider: 'google',
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
