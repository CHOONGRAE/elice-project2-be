import { CreateFandomDto } from '@dto/fandomDto/create-fandom.dto';
import { DeleteFandomDto } from '@dto/fandomDto/delete-fandom.dto';
import { UpdateFandomDto } from '@dto/fandomDto/update-fandom.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PaginateFandomDto } from '@dto/fandomDto/paginate-fandom.dto';

@Injectable()
export class FandomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async createFandom(createFandomDto: CreateFandomDto) {
    const { userId, fandomName, file } = createFandomDto;

    const {
      messages,
      _count: { subscribes: memberLength },
      ...createdFandom
    } = await this.prisma.fandoms.create({
      data: {
        userId,
        fandomName,
        image: await this.s3.uploadImage(file, `fandoms/admin-${userId}/`),
        subscribes: {
          create: {
            userId,
          },
        },
        rank: {
          create: {
            point: 0,
          },
        },
      },
      select: this.selectField,
    });

    return {
      data: {
        ...createdFandom,
        memberLength,
        lastChatTime: messages[0]?.createdAt || null,
      },
    };
  }

  async updateFandom(updateFandomDto: UpdateFandomDto) {
    const { id, userId, fandomName, file } = updateFandomDto;

    const {
      messages,
      _count: { subscribes: memberLength },
      ...updatedFandom
    } = await this.prisma.fandoms
      .update({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        data: {
          fandomName,
          image:
            file &&
            (await this.s3.uploadImage(file, `fandoms/admin-${userId}/`)),
        },
        select: this.selectField,
      })
      .catch(() => {
        throw new ForbiddenException();
      });

    return {
      data: {
        ...updatedFandom,
        memberLength,
        lastChatTime: messages[0]?.createdAt || null,
      },
    };
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

  async getFandoms(paginateFandomDto: PaginateFandomDto) {
    const result = await this.makeSortedFandoms(paginateFandomDto);

    return result;
  }

  async getHotFandoms() {
    const result = await this.makeSortedFandoms({ perPage: 4, page: 1 });

    return { data: result.data };
  }

  async getFandomsByUser(userId: number, paginateFandomDto: PaginateFandomDto) {
    const { page, perPage } = paginateFandomDto;

    const result = await this.prisma.fandoms.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where: {
        deletedAt: null,
        subscribes: {
          some: {
            userId,
          },
        },
      },
      select: this.selectField,
      orderBy: [
        {
          rank: {
            point: 'desc',
          },
        },
        { createdAt: 'desc' },
      ],
    });

    const totalCount = await this.prisma.fandoms.count({
      where: {
        deletedAt: null,
        subscribes: {
          some: {
            userId,
          },
        },
      },
    });

    return {
      data: result.map(
        ({
          id,
          fandomName,
          image,
          _count: { subscribes: memberLength },
          messages,
        }) => ({
          id,
          fandomName,
          image,
          memberLength,
          lastChatTime: messages[0]?.createdAt || null,
        }),
      ),
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async getFandomsBySearch(searchString: string) {
    const searchResult = await this.prisma.fandoms.findMany({
      where: {
        fandomName: { contains: searchString },
        deletedAt: null,
      },
      select: this.selectField,
      orderBy: [
        {
          rank: {
            point: 'desc',
          },
        },
        { createdAt: 'desc' },
      ],
    });

    return {
      data: searchResult.map(
        ({
          id,
          fandomName,
          image,
          _count: { subscribes: memberLength },
          messages,
        }) => ({
          id,
          fandomName,
          image,
          memberLength,
          lastChatTime: messages[0]?.createdAt || null,
        }),
      ),
    };
  }

  async getFandomById(fandomId: number) {
    try {
      const {
        id,
        fandomName,
        image,
        _count: { subscribes: memberLength },
        messages,
      } = await this.prisma.fandoms.findUnique({
        where: {
          id: fandomId,
          deletedAt: null,
        },
        select: this.selectField,
      });

      return {
        data: {
          id,
          fandomName,
          image,
          memberLength,
          lastChatTime: messages[0]?.createdAt || null,
        },
      };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  private async makeSortedFandoms(paginateFandomDto: PaginateFandomDto) {
    const { page, perPage } = paginateFandomDto;

    const result = await this.prisma.fandomRanks.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where: {
        fandom: {
          deletedAt: null,
        },
      },
      orderBy: [
        {
          point: 'desc',
        },
        {
          fandom: {
            createdAt: 'desc',
          },
        },
      ],
      select: {
        fandom: {
          select: this.selectField,
        },
      },
    });

    const totalCount = await this.prisma.fandoms.count({
      where: {
        deletedAt: null,
      },
    });

    return {
      data: result.map(
        (
          {
            fandom: {
              id,
              fandomName,
              image,
              _count: { subscribes: memberLength },
              messages,
            },
          },
          i,
        ) => ({
          id,
          rank: i + 1,
          fandomName,
          image,
          memberLength,
          lastChatTime: messages[0]?.createdAt || null,
        }),
      ),
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  private readonly selectField: Prisma.FandomsSelect<DefaultArgs> = {
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
    messages: {
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      select: {
        createdAt: true,
      },
    },
  };
}
