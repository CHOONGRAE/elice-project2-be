import { CreateMessageDto } from '@dto/messageDto/create-message.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async findMessagesForRoomByUser(room: number, userId: number) {
    const { messageId, uponJoiningMessageId } = await this.getReadedMessage(
      room,
      userId,
    );

    const messages = await this.prisma.messages.findMany({
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
        files: {
          select: {
            url: true,
          },
        },
      },
    });

    return messages.map(({ files: urls, ...message }) => ({
      ...message,
      images: urls.map(({ url }) => url),
    }));
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

  async createFilesMessage(
    userId: number,
    files: Express.Multer.File[],
    createMessageDto: CreateMessageDto,
  ) {
    const images = await Promise.all(
      files.map((file) =>
        this.s3.uploadImage(
          file,
          `messages/fandom-${createMessageDto.fandomId}/user-${userId}/`,
        ),
      ),
    );

    const { files: urls, ...result } = await this.prisma.messages.create({
      data: {
        userId,
        ...createMessageDto,
        content: '-',
        files: {
          createMany: {
            data: images.map((url) => ({ url })),
          },
        },
      },
      select: {
        files: {
          select: {
            url: true,
          },
        },
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

    return { ...result, images: urls.map(({ url }) => url) };
  }
}
