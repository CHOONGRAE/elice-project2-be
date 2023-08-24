import { CreateSonminsuAnswerDto } from '@dto/sonminsuAnswerDto/create-sonminsuAnswer.dto';
import { UpdateSonminsuAnswerDto } from '@dto/sonminsuAnswerDto/update-sonminsuAnswer.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class SonminsuAnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async createSonminsuAnswer(
    userId: number,
    createSonminsuAnswerDto: CreateSonminsuAnswerDto,
  ) {
    const { requestId, itemIds } = createSonminsuAnswerDto;

    const createdSonminsuAnswer = await this.prisma.sonminsuAnswers.create({
      data: {
        userId,
        requestId,
        content: 'test',
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
    const updatedSonminsuAnswer = await this.prisma.sonminsuAnswers.update({
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
    });

    return { data: updatedSonminsuAnswer };
  }

  async deleteSonminsuAnswer(id: number, userId: number) {
    const deletedSonminsuAnswer = await this.prisma.sonminsuAnswers
      .update({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date().toISOString(),
        },
        select: {
          deletedAt: true,
        },
      })
      .catch(() => {
        throw new ConflictException();
      });

    return { data: deletedSonminsuAnswer };
  }

  private readonly selectField = {
    id: true,
    requestId: true,
    user: {
      select: {
        id: true,
        nickName: true,
        profileImgUrl: true,
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
