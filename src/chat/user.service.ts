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

  async checkAdmin(userId: number, fandomId: number) {
    return !!(await this.prisma.fandoms.findUnique({
      where: {
        id: fandomId,
        userId,
        deletedAt: null,
      },
    }));
  }

  async checkJail(userId: number, fandomId: number) {
    return await this.redis.get(`room-${fandomId}-${userId}`);
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
      isAdmin?: boolean;
      subscribes?: { userId: number };
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
        subscribes: {
          where: {
            fandomId,
          },
          select: { userId: true },
        },
      },
    });

    if (isAdmin) {
      for (let i = 0, len = users.length; i < len; i++) {
        const isJail = await this.checkJail(users[i].id, fandomId);
        users[i] = { ...users[i], isJail: !!isJail };
      }
    }

    return users.map(({ subscribes, ...user }) => ({
      ...user,
      isAdmin: subscribes.userId === userId,
    }));
  }

  async userToggleJail(fandomId: number, userId: number, admin: number) {
    const isAdmin = await this.prisma.fandoms.findUnique({
      where: {
        id: fandomId,
        userId: admin,
      },
    });

    if (isAdmin) {
      const check = await this.checkJail(userId, fandomId);
      if (check) await this.redis.delete(`room-${fandomId}-${userId}`);
      else await this.redis.set(`room-${fandomId}-${userId}`, 'jail', 0);
    }

    return true;
  }
}
