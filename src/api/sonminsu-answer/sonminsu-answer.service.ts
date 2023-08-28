import { CreateSonminsuAnswerDto } from '@dto/sonminsuAnswerDto/create-sonminsuAnswer.dto';
import { UpdateSonminsuAnswerDto } from '@dto/sonminsuAnswerDto/update-sonminsuAnswer.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class SonminsuAnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async createSonminsuAnswer(
    userId: number,
    requestId: number,
    createSonminsuAnswerDto: CreateSonminsuAnswerDto,
  ) {
    const { itemIds } = createSonminsuAnswerDto;

    const createdSonminsuAnswer = await this.prisma.sonminsuAnswers.create({
      data: {
        userId,
        requestId,
        items: {
          connect: itemIds.map((id) => ({ id })),
        },
      },
      select: this.selectField,
    });

    return { data: createdSonminsuAnswer };
  }

  async updateSonminsuAnswer(
    id: number,
    userId: number,
    updateSonminsuAnswerDto: UpdateSonminsuAnswerDto,
  ) {
    const updatedSonminsuAnswer = await this.prisma.sonminsuAnswers
      .update({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        data: {
          items: {
            connect: updateSonminsuAnswerDto.itemIds.map((id) => ({ id })),
          },
        },
        select: this.selectField,
      })
      .catch(() => {
        throw new BadRequestException();
      });

    return { data: updatedSonminsuAnswer };
  }

  async deleteSonminsuAnswer(id: number, userId: number) {
    await this.prisma.sonminsuAnswers
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

  async chooseSonminsuAnswer(answerId: number, userId: number) {
    const result = await this.prisma.sonminsuAnswers
      .update({
        where: {
          id: answerId,
          request: {
            userId,
            answers: {
              every: {
                isChoosed: null,
              },
            },
          },
          deletedAt: null,
        },
        data: {
          isChoosed: true,
          items: {
            updateMany: {
              where: {
                answerId,
              },
              data: {
                registration: true,
              },
            },
          },
        },
        select: this.selectField,
      })
      .catch(() => {
        throw new BadRequestException();
      });

    return { data: result };
  }

  private readonly selectField = {
    id: true,
    requestId: true,
    user: {
      select: {
        id: true,
        nickName: true,
        image: true,
        _count: {
          select: {
            sonminsuAnswers: {
              where: {
                isChoosed: true,
              },
            },
          },
        },
      },
    },
    items: {
      select: {
        id: true,
        originUrl: true,
        title: true,
        price: true,
      },
    },
    createdAt: true,
  };
}
