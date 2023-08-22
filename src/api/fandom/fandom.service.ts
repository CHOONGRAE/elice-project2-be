import { CreateFandomDto } from '@dto/fandomDto/create-fandom.dto';
import { UpdateFandomDto } from '@dto/fandomDto/update-fandom.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class FandomService {
  constructor(private readonly prisma: PrismaService) {}

  async createFandom(createFandomDto: CreateFandomDto) {
    const createdFandom = await this.prisma.fandoms.create({
      data: createFandomDto,
    });

    return { data: createdFandom };
  }

  async updateFandom(fandomId: number, updateFandomDto: UpdateFandomDto) {
    const updatedFandom = await this.prisma.fandoms.update({
      where: {
        id: fandomId,
      },
      data: updateFandomDto,
    });

    return { data: updatedFandom };
  }

  async deleteFandom(fandomId: number) {
    const deletedFandom = await this.prisma.fandoms.delete({
      where: {
        id: fandomId,
      },
    });

    return { data: deletedFandom };
  }

  async getFandoms() {
    const fandoms = await this.makeSortedFandoms();

    return { data: fandoms };
  }

  async getHotFandoms() {
    const fandoms = await this.makeSortedFandoms(4);

    return { data: fandoms };
  }

  async getFandomsByUser(userId: number) {
    const userFandoms = await this.prisma.fandoms.findMany({
      include: {
        subscribes: {
          where: {
            userId,
          },
        },
      },
    });

    return { data: userFandoms };
  }

  async getFandomsBySearch(searchString: string) {
    const searchResult = await this.prisma.fandoms.findMany({
      where: {
        fandomName: { contains: searchString },
      },
    });

    return { data: searchResult };
  }

  private async makeSortedFandoms(take = 10, skip = 0) {
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
      skip,
      take,
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
