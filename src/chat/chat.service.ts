import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoomsForUser(userId: number) {
    const rooms = await this.prisma.subscribes.findMany({
      where: {
        userId,
      },
      select: {
        fandom: {
          select: {
            id: true,
            fandomName: true,
            image: true,
          },
        },
      },
    });

    return rooms.map(({ fandom }) => fandom);
  }
}
