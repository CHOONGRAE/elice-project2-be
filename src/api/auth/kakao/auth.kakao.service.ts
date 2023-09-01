import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthKakaoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signInKakao(data: { code: string; domain: string }) {
    const { code, domain } = data;

    const kakaoKey = this.config.get('KAKAO_KEY');
    const secret = this.config.get('KAKAO_SECRET');
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';

    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoKey,
      redirect_uri: `${domain}/login/kakao-callback`,
      code,
      client_secret: secret,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const res = await axios.post(kakaoTokenUrl, body, { headers });
      const { id_token } = res.data;
      const payload = this.jwt.decode(res.data.id_token) as {
        nickname: string;
        picture: string;
        email: string;
      };
      const { nickname, picture, email } = payload;

      const hassedToken = await bcrypt.hash(id_token, 10);

      const isSignedUp = await this.prisma.auth.findUnique({
        where: {
          email,
          kakao: hassedToken,
          users: {
            some: {
              deletedAt: null,
            },
          },
        },
        include: { users: true },
      });

      if (isSignedUp) {
        const {
          users: [{ id, nickName, introduction, image }],
        } = isSignedUp;

        const token = await this.auth.createTokens(id, email);

        return {
          data: {
            id,
            nickName,
            introduction,
            image,
          },
          token,
        };
      }

      const isExistence = await this.prisma.auth.findUnique({
        where: {
          email,
        },
      });

      if (isExistence) {
        const info = await this.prisma.auth.update({
          where: {
            id: isExistence.id,
          },
          data: {
            kakao: hassedToken,
          },
          include: {
            users: true,
          },
        });

        const {
          users: [{ id, nickName, introduction, image }],
        } = info;

        const token = await this.auth.createTokens(id, email);

        return {
          data: {
            id,
            nickName,
            introduction,
            image,
          },
          token,
        };
      }

      const newAuth = await this.prisma.auth.create({
        data: {
          email,
          kakao: hassedToken,
          users: {
            create: {
              nickName: nickname,
              image: picture,
            },
          },
        },
        include: {
          users: true,
        },
      });

      const {
        users: [{ id, nickName, introduction, image }],
      } = newAuth;

      const token = await this.auth.createTokens(id, email);

      return {
        data: {
          id,
          nickName,
          introduction,
          image,
        },
        token,
      };
    } catch {}
  }
}
