import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async findMessagesForRoomByUser(room: number, userId: number) {
    const { messageId, uponJoiningMessageId } = await this.getReadedMessage(
      room,
      userId,
    );

    const messages = this.prisma.messages.findMany({
      where: {
        AND: [
          { fandomId: room },
          {
            id: { gt: messageId },
          },
          { id: { gt: uponJoiningMessageId } },
        ],
      },
      orderBy: { createdAt: 'asc' },
      select: {
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            nickName: true,
            image: true,
          },
        },
      },
    });

    return messages;
  }

  async getReadedMessage(room: number, userId: number) {
    const readedMessage = await this.prisma.readedMessages.findUnique({
      where: {
        userId_fandomId: { userId, fandomId: room },
      },
    });

    return readedMessage;
  }

  async createReadedMessage(room: number, userId: number) {
    const results = await this.prisma.messages.findMany({
      where: {
        fandomId: room,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      select: {
        id: true,
      },
    });

    const messageId = results[0]?.id;

    const readedMessage = await this.prisma.readedMessages.create({
      data: {
        userId,
        fandomId: room,
        messageId: messageId,
        uponJoiningMessageId: messageId,
      },
    });

    return readedMessage;
  }

  async createMessage(userId: number, room: number, content: string) {
    const message = await this.prisma.messages.create({
      data: {
        userId,
        fandomId: room,
        content,
      },
      select: {
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            nickName: true,
            image: true,
          },
        },
      },
    });

    return message;
  }
}
