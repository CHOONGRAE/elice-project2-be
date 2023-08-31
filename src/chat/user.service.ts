import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RedisService } from '@redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getUser(id: number) {
    return await this.prisma.users.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        nickName: true,
        image: true,
      },
    });
  }

  async getMembers(fandomId: number, userId: number, search = '') {
    const isAdmin = await this.prisma.fandoms.findUnique({
      where: {
        id: fandomId,
        userId,
      },
    });

    const users: {
      id: number;
      nickName: string;
      image: string;
      isJail?: boolean;
    }[] = await this.prisma.users.findMany({
      where: {
        deletedAt: null,
        subscribes: {
          some: {
            fandomId,
          },
        },
        nickName: {
          contains: search,
        },
      },
      orderBy: {
        nickName: 'asc',
      },
      select: {
        id: true,
        nickName: true,
        image: true,
      },
    });

    if (isAdmin) {
      for (let i = 0, len = users.length; i < len; i++) {
        const isJail = await this.redis.get(`room-${fandomId}-${users[i].id}`);
        users[i] = { ...users[i], isJail: !!isJail };
      }
    }

    return users;
  }

  async userToJail(fandomId: number, userId: number, admin: number) {
    const isAdmin = await this.prisma.fandoms.findUnique({
      where: {
        id: fandomId,
        userId: admin,
      },
    });

    if (isAdmin) {
      await this.redis.set(`room-${fandomId}-${userId}`, '', 0);
    }

    return true;
  }
}
