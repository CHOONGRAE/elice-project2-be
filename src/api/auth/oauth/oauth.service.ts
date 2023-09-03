import { PrismaService } from '@prisma/prisma.service';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

type Auth = {
  sub: string | Buffer;
  email: string;
  name: string;
  picture: string;
  provider: string;
};

@Injectable()
export class OauthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async getOrCreateAuth({ sub, email, name, picture, provider }: Auth) {
    const hassedSub = await bcrypt.hash(sub, 10);

    const isSignedUp = await this.prisma.auth.findUnique({
      where: {
        email,
        [provider]: hassedSub,
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
          [provider]: hassedSub,
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
        [provider]: hassedSub,
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
  }
}
