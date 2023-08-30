import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
}
