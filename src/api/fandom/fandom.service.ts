import { CreateFandomDto } from '@dto/fandomDto/create-fandom.dto';
import { DeleteFandomDto } from '@dto/fandomDto/delete-fandom.dto';
import { UpdateFandomDto } from '@dto/fandomDto/update-fandom.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FandomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async createFandom(createFandomDto: CreateFandomDto) {
    const { userId, fandomName, image } = createFandomDto;

    const createdFandom = await this.prisma.fandoms.create({
      data: {
        userId,
        fandomName,
        thumbnailImgUrl: await this.s3.uploadImage(
          image,
          `fandoms/admin-${userId}/`,
        ),
      },
      select: {
        id: true,
        userId: true,
        fandomName: true,
        thumbnailImgUrl: true,
      },
    });

    return { data: createdFandom };
  }

  async updateFandom(updateFandomDto: UpdateFandomDto) {
    const { id, userId, fandomName, image } = updateFandomDto;

    const updatedFandom = await this.prisma.fandoms
      .update({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        data: {
          fandomName,
          thumbnailImgUrl:
            image &&
            (await this.s3.uploadImage(image, `fandoms/admin-${userId}/`)),
        },
        select: {
          id: true,
          userId: true,
          fandomName: true,
          thumbnailImgUrl: true,
        },
      })
      .catch(() => {
        throw new ForbiddenException();
      });

    return { data: updatedFandom };
  }

  async deleteFandom(deleteFandomDto: DeleteFandomDto) {
    await this.prisma.fandoms
      .update({
        where: {
          ...deleteFandomDto,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date().toISOString(),
        },
      })
      .catch(() => {
        throw new ForbiddenException();
      });
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
    console.log(userId);
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
