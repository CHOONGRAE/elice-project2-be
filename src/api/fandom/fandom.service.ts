import { CreateFandomDto } from '@dto/fandomDto/create-fandom.dto';
import { UpdateFandomDto } from '@dto/fandomDto/update-fandom.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class FandomService {
  constructor(private readonly prisma: PrismaService) {}

  async createFandom(createFandomDto: CreateFandomDto) {
    await this.prisma.fandoms.create({
      data: createFandomDto,
    });
  }

  async updateFandom(fandomId: number, updateFandomDto: UpdateFandomDto) {
    await this.prisma.fandoms.update({
      where: {
        id: fandomId,
      },
      data: updateFandomDto,
    });
  }

  async deleteFandom(fandomId: number) {
    await this.prisma.fandoms.delete({
      where: {
        id: fandomId,
      },
    });
  }

  async getFandoms() {
    return { data: await this.makeSortedFandoms() };
  }

  async getHotFandoms() {
    return { data: await this.makeSortedFandoms() };
  }

  async getFandomsByUser() {
    return 'test';
  }

  async getFandomsBySearch() {
    return 'test';
  }

  private async makeSortedFandoms() {
    const result = await this.prisma.fandoms.findMany({
      include: {
        _count: {
          select: { subscribes: true },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            createdAt: true,
          },
        },
      },
      take: 4,
      orderBy: [
        {
          rank: {
            point: 'desc',
          },
        },
        { createdAt: 'asc' },
      ],
    });

    return result.map(
      (
        {
          id,
          fandomName,
          thumbnailImgUrl,
          _count: { subscribes: memberLength },
          messages,
        },
        i,
      ) => ({
        id,
        rank: i + 1,
        fandomName,
        thumbnailImgUrl,
        memberLength,
        lastChatTime: messages[0]?.createdAt || null,
      }),
    );
  }
}
