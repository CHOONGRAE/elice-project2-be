import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { MessageService } from './message.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly message: MessageService,
  ) {}

  async getRoomsForUser(userId: number) {
    const rooms = await this.prisma.subscribes.findMany({
      where: {
        userId,
        fandom: {
          deletedAt: null,
        },
      },
      select: {
        fandom: {
          select: {
            id: true,
            fandomName: true,
            image: true,
            _count: {
              select: {
                subscribes: {
                  where: {
                    user: {
                      deletedAt: null,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return rooms.map(
      ({
        fandom: {
          _count: { subscribes: memberLength },
          ...fandom
        },
      }) => ({
        ...fandom,
        memberLength,
      }),
    );
  }

  async getRoomInfo({
    messageId,
    uponJoiningMessageId,
    fandomId,
  }: {
    [key: string]: number;
  }) {
    const newMessage = await this.prisma.messages.count({
      where: {
        AND: [
          { fandomId },
          {
            id: { gt: messageId },
          },
          { id: { gt: uponJoiningMessageId } },
          { deletedAt: null },
        ],
      },
    });

    const lastMessage = await this.prisma.messages.findMany({
      where: {
        AND: [
          { fandomId },
          {
            id: { gt: messageId },
          },
          { id: { gt: uponJoiningMessageId } },
          { deletedAt: null },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
      select: {
        content: true,
        createdAt: true,
        files: {
          select: {
            url: true,
          },
        },
      },
    });

    return { newMessage, lastMessage };
  }
}
