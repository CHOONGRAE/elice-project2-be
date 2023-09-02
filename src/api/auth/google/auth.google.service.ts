import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import axios from 'axios';

@Injectable()
export class AuthGoogleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}
  async signInGoogle(data: { code: string; domain: string }) {
    const { code, domain } = data;

    const googleKey = this.config.get('GOOGLE_AUTH_ID');
    const secret = this.config.get('GOOGLE_AUTH_SECRET');
    const googleTokenUrl = 'https://oauth2.googleapis.com/token';

    const body = {
      grant_type: 'authorization_code',
      client_id: googleKey,
      client_secret: secret,
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

      const hassedSub = await bcrypt.hash(sub, 10);

      const isSignedUp = await this.prisma.auth.findUnique({
        where: {
          email,
          google: hassedSub,
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
            google: hassedSub,
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
          google: hassedSub,
          users: {
            create: {
              nickName: name,
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
    } catch {
      throw new UnauthorizedException();
    }
  }
}
