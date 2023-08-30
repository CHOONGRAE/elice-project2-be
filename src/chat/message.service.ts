import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async findMessageForRoom(room: number, userId: number) {
    return [];
  }
  async readedMessage(room: number, userId: number) {
    return;
  }

  async createMessage(userId: number, room: number, content: string) {
    const result = await this.prisma.messages.create({
      data: {
        userId,
        fandomId: room,
        content,
      },
    });

    return result;
  }
}
