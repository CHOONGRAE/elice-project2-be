import { CreateSonminsuRequestDto } from '@dto/sonminsuRequestDto/create-sonminsuRequest.dto';
import { GetSonminsuRequestDto } from '@dto/sonminsuRequestDto/get-sonmisuRequest.dto';
import { PaginateSonminsuRequestDto } from '@dto/sonminsuRequestDto/paginate-sonminsuRequest.dto';
import { UpdateSonminsuRequestDto } from '@dto/sonminsuRequestDto/update-sonminsuRequest.dto';
import { ConflictException, Injectable } from '@nestjs/common';
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

    const { images, ...createdSonminsuRequest } =
      await this.prisma.sonminsuRequests.create({
        data: {
          userId,
          title,
          content,
          groupName,
          artistName,
          images: {
            create: {
              url: await this.s3.uploadImage(
                image,
                `requests/author-${userId}/`,
              ),
            },
          },
        },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              nickName: true,
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
                  profileImgUrl: true,
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
                  originUrl: true,
                  imgUrl: true,
                  price: true,
                },
              },
            },
          },
        },
      });

    return {
      data: { ...createdSonminsuRequest, image: images[0]?.url || null },
    };
  }

  async updateSonminsuRequest(
    id: number,
    userId: number,
    updateSonminsuRequestDto: UpdateSonminsuRequestDto,
  ) {
    const { images, ...updatedSonminsuRequest } =
      await this.prisma.sonminsuRequests.update({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        data: {
          ...updateSonminsuRequestDto,
        },
        include: {
          images: true,
        },
      });
    return {
      data: { ...updatedSonminsuRequest, image: images[0]?.url || null },
    };
  }

  async deleteSonminsuRequest(id: number, userId: number) {
    const deletedSonminsuRequest = await this.prisma.sonminsuRequests
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
        throw new ConflictException();
      });

    return deletedSonminsuRequest;
  }

  async getSonminsuRequests(getSonminsuRequestDto: GetSonminsuRequestDto) {
    const { done, page, perPage } = getSonminsuRequestDto;

    const [result, totalCount] = await this.prisma.$transaction([
      this.prisma.sonminsuRequests.findMany({
        skip: Math.max(0, (perPage || 10) * ((page || 1) - 1)),
        take: Math.max(0, perPage || 10),
        where: {
          isDone: done,
          deletedAt: null,
        },
        select: this.listSelectField,
      }),
      this.prisma.sonminsuRequests.count({
        where: {
          isDone: done,
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: result.map(({ images, ...value }) => ({
        image: images[0]?.url || null,
        ...value,
      })),
      totalPage: Math.ceil(totalCount / (perPage || 10)),
      currentPage: page || 1,
    };
  }

  async getSonminsuRequestsByUser(
    userId: number,
    getSonminsuRequestDto: GetSonminsuRequestDto,
  ) {
    const { done, page, perPage } = getSonminsuRequestDto;

    const [result, totalCount] = await this.prisma.$transaction([
      this.prisma.sonminsuRequests.findMany({
        skip: Math.max(0, (perPage || 10) * ((page || 1) - 1)),
        take: Math.max(0, perPage || 10),
        where: {
          userId,
          isDone: done,
          deletedAt: null,
        },
        select: this.listSelectField,
      }),
      this.prisma.sonminsuRequests.count({
        where: {
          userId,
          isDone: done,
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: result.map(({ images, ...value }) => ({
        image: images[0]?.url || null,
        ...value,
      })),
      totalPage: Math.ceil(totalCount / (perPage || 10)),
      currentPage: page || 1,
    };
  }

  async getSonminsuRequestsByBookmark(
    userId: number,
    paginateSonminsuRequestDto: PaginateSonminsuRequestDto,
  ) {
    const { page, perPage } = paginateSonminsuRequestDto;

    const [result, totalCount] = await this.prisma.$transaction([
      this.prisma.sonminsuRequestBookmarks.findMany({
        skip: Math.max(0, (perPage || 10) * ((page || 1) - 1)),
        take: Math.max(0, perPage || 10),
        where: {
          userId,
          requrest: {
            deletedAt: null,
          },
        },
        select: {
          requrest: {
            where: {
              deletedAt: null,
            },
            select: this.listSelectField,
          },
        },
      }),
      this.prisma.sonminsuRequestBookmarks.count({
        where: {
          userId,
          requrest: {
            deletedAt: null,
          },
        },
      }),
    ]);

    return {
      data: result.map(({ requrest: { images, ...value } }) => ({
        image: images[0]?.url || null,
        ...value,
      })),
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

    return { data: result };
  }

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
        },
      },
      createdAt: true,
    };

  private readonly detailSelectField: Prisma.SonminsuRequestsSelect<DefaultArgs> =
    {
      id: true,
      user: {
        select: {
          id: true,
          nickName: true,
        },
      },
      images: {
        select: {
          url: true,
        },
      },
      _count: {
        select: {
          answers: true,
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
              profileImgUrl: true,
              nickName: true,
            },
            include: {
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
              originUrl: true,
              imgUrl: true,
              price: true,
            },
          },
        },
      },
    };
}
