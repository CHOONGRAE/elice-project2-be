import { CreateSonminsuRequestDto } from '@dto/sonminsuRequestDto/create-sonminsuRequest.dto';
import { GetSonminsuRequestDto } from '@dto/sonminsuRequestDto/get-sonmisuRequest.dto';
import { PaginateSonminsuRequestDto } from '@dto/sonminsuRequestDto/paginate-sonminsuRequest.dto';
import { UpdateSonminsuRequestDto } from '@dto/sonminsuRequestDto/update-sonminsuRequest.dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '@prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class SonminsuRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async createSonminsuRequest(
    userId: number,
    createSonminsuRequestDto: CreateSonminsuRequestDto,
  ) {
    const { title, content, groupName, artistName, image } =
      createSonminsuRequestDto;

    const createdSonminsuRequest = await this.prisma.sonminsuRequests.create({
      data: {
        userId,
        title,
        content,
        groupName,
        artistName,
        images: {
          create: {
            url: await this.s3.uploadImage(image, `requests/author-${userId}/`),
          },
        },
      },
      select: this.detailSelectField,
    });

    return {
      data: this.transFormDetailData(createdSonminsuRequest),
    };
  }

  async updateSonminsuRequest(
    id: number,
    userId: number,
    updateSonminsuRequestDto: UpdateSonminsuRequestDto,
  ) {
    const { title, content, groupName, artistName, image } =
      updateSonminsuRequestDto;

    const updatedSonminsuRequest = await this.prisma.sonminsuRequests.update({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data: {
        title,
        content,
        groupName,
        artistName,
        images: {
          deleteMany: {},
          create: {
            url: await this.s3.uploadImage(image, `requests/author-${userId}/`),
          },
        },
      },
      select: this.detailSelectField,
    });

    return {
      data: this.transFormDetailData(updatedSonminsuRequest),
    };
  }

  async deleteSonminsuRequest(id: number, userId: number) {
    await this.prisma.sonminsuRequests
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
        throw new ForbiddenException();
      });
  }

  async getSonminsuRequests(getSonminsuRequestDto: GetSonminsuRequestDto) {
    const { done, page, perPage } = getSonminsuRequestDto;

    const result = await this.prisma.sonminsuRequests.findMany({
      skip: Math.max(0, (perPage || 10) * ((page || 1) - 1)),
      take: Math.max(0, perPage || 10),
      where: {
        isDone: done,
        deletedAt: null,
      },
      select: this.listSelectField,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await this.prisma.sonminsuRequests.count({
      where: {
        isDone: done,
        deletedAt: null,
      },
    });

    return {
      data: result.map(this.transFormData),
      totalPage: Math.ceil(totalCount / (perPage || 10)),
      currentPage: page || 1,
    };
  }

  async getSonminsuRequestsByUser(
    userId: number,
    getSonminsuRequestDto: GetSonminsuRequestDto,
  ) {
    const { done, page, perPage } = getSonminsuRequestDto;

    const result = await this.prisma.sonminsuRequests.findMany({
      skip: Math.max(0, (perPage || 10) * ((page || 1) - 1)),
      take: Math.max(0, perPage || 10),
      where: {
        userId,
        isDone: done,
        deletedAt: null,
      },
      select: this.listSelectField,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await this.prisma.sonminsuRequests.count({
      where: {
        userId,
        isDone: done,
        deletedAt: null,
      },
    });

    return {
      data: result.map(this.transFormData),
      totalPage: Math.ceil(totalCount / (perPage || 10)),
      currentPage: page || 1,
    };
  }

  async getSonminsuRequestsByBookmark(
    userId: number,
    paginateSonminsuRequestDto: PaginateSonminsuRequestDto,
  ) {
    const { page, perPage } = paginateSonminsuRequestDto;

    const result = await this.prisma.sonminsuRequestBookmarks.findMany({
      skip: Math.max(0, (perPage || 10) * ((page || 1) - 1)),
      take: Math.max(0, perPage || 10),
      where: {
        userId,
        request: {
          deletedAt: null,
        },
      },
      select: {
        request: {
          select: this.listSelectField,
        },
      },
      orderBy: {
        request: {
          createdAt: 'desc',
        },
      },
    });

    const totalCount = await this.prisma.sonminsuRequestBookmarks.count({
      where: {
        userId,
        request: {
          deletedAt: null,
        },
      },
    });

    return {
      data: result.map(({ request }) => this.transFormData(request)),
      totalPage: Math.ceil(totalCount / (perPage || 10)),
      currentPage: page || 1,
    };
  }

  async getSonminsuRequest(id: number) {
    const result = await this.prisma.sonminsuRequests.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: this.detailSelectField,
    });

    return {
      data: this.transFormDetailData(result),
    };
  }

  private readonly transFormData = ({ images, ...value }) => ({
    image: images[0]?.url || null,
    ...value,
  });

  private readonly transFormDetailData = ({
    images,
    _count,
    answers,
    ...data
  }) => ({
    image: images[0]?.url || null,
    ...data,
    answerCnt: _count.answers,
    answers: answers.map(({ user: { _count, ...user }, ...answer }) => ({
      ...answer,
      user: {
        ...user,
        choosedCnt: _count.sonminsuAnswers,
      },
    })),
  });

  private readonly listSelectField: Prisma.SonminsuRequestsSelect<DefaultArgs> =
    {
      id: true,
      images: {
        select: {
          url: true,
        },
      },
      title: true,
      user: {
        select: {
          id: true,
          nickName: true,
          image: true,
        },
      },
      createdAt: true,
    };

  private readonly detailSelectField: Prisma.SonminsuRequestsSelect<DefaultArgs> =
    {
      id: true,
      title: true,
      content: true,
      groupName: true,
      artistName: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          nickName: true,
          image: true,
        },
      },
      images: {
        select: {
          url: true,
        },
      },
      _count: {
        select: {
          answers: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
      answers: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              image: true,
              nickName: true,
              _count: {
                select: {
                  sonminsuAnswers: {
                    where: { isChoosed: true },
                  },
                },
              },
            },
          },
          items: {
            select: {
              id: true,
              title: true,
              originUrl: true,
              imgUrl: true,
              price: true,
            },
          },
          createdAt: true,
        },
      },
    };
}
