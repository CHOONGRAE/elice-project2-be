import { CreateCommentDto } from '@dto/commentDto/create-comment.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    userId: number,
    feedId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const createdComment = await this.prisma.comments.create({
      data: {
        userId,
        feedId,
        ...createCommentDto,
      },
      select: this.selectField,
    });

    return { data: createdComment };
  }

  async deleteComment(id: number, userId: number) {
    await this.prisma.comments
      .update({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date().toISOString(),
        },
      })
      .catch(() => {
        throw new BadRequestException();
      });
  }

  async getComments(feedId: number) {
    const result = await this.prisma.comments.findMany({
      where: {
        feedId,
        parent: null,
        deletedAt: null,
      },
      select: {
        ...this.selectField,
        replies: {
          where: {
            deletedAt: null,
          },
          select: this.selectField,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: result };
  }

  private readonly selectField: Prisma.CommentsSelect<DefaultArgs> = {
    id: true,
    feedId: true,
    parent: true,
    author: {
      select: {
        id: true,
        nickName: true,
        image: true,
      },
    },
    content: true,
    createdAt: true,
  };
}
