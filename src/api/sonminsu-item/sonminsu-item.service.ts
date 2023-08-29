import { CreateSonminsuItemDto } from '@dto/sonminsuItemDto/create-sonminsuItem.dto';
import { PaginateSonminsuItemDto } from '@dto/sonminsuItemDto/paginate-sonminsuItem.dto';
import { SearchSonminsuItemDto } from '@dto/sonminsuItemDto/search-sonminsuItem.dto';
import { UpdateSonminsuItemDto } from '@dto/sonminsuItemDto/update-sonminsuItem.dto';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '@prisma/prisma.service';
import { ScraperService } from 'src/scraper/scraper.service';

@Injectable()
export class SonminsuItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scraper: ScraperService,
  ) {}

  async createSonminsuItem({
    originUrl,
    groupName,
    artistName,
  }: CreateSonminsuItemDto) {
    const { image, title, price, url } = await this.scraper.doScrap(originUrl);

    const result = await this.prisma.sonminsuItems.create({
      data: {
        imgUrl: image,
        title: title,
        price: price || '정보없음',
        originUrl: url,
        groupName,
        artistName,
      },
      select: this.selectField,
    });

    return { data: this.transformData(result) };
  }

  async updateSonminsuItem(
    id: number,
    updateSonminsuItemDto: UpdateSonminsuItemDto,
  ) {
    const result = await this.prisma.sonminsuItems.update({
      where: { id },
      data: updateSonminsuItemDto,
      select: this.selectField,
    });

    return { data: this.transformData(result) };
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async deleteNoForeignKeySonminsuItems() {
    await this.prisma.sonminsuItems.deleteMany({
      where: {
        AND: [
          { feedId: null },
          { answerId: null },
          {
            createdAt: {
              lte: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            },
          },
        ],
      },
    });
  }

  async getSonminsuItems(pagination: PaginateSonminsuItemDto) {
    const { page, perPage } = pagination;

    const result = await this.prisma.sonminsuItems.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where: {
        OR: [
          {
            feedId: { not: null },
            feed: {
              deletedAt: null,
            },
          },
          {
            answerId: { not: null },
            registration: true,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: this.selectField,
    });

    const totalCount = await this.prisma.sonminsuItems.count({
      where: {
        OR: [
          {
            feedId: { not: null },
            feed: {
              deletedAt: null,
            },
          },
          {
            answerId: { not: null },
            registration: true,
          },
        ],
      },
    });

    return {
      data: result.map(this.transformData),
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async getSonminsuItemsByUser(
    userId: number,
    pagination: PaginateSonminsuItemDto,
  ) {
    const { page, perPage } = pagination;

    const results: Array<
      Prisma.SonminsuItemsFieldRefs & { isInBucket: number | null }
    > = await this.prisma.$queryRaw`
      SELECT I.id, I.origin_url AS "originUrl", I.title, I.price, I.image_url AS "imageUrl", I.group_name AS "groupName", I.artist_name AS "artistName", I.created_at AS "createdAt",
      CASE WHEN B.user_id IS NOT NULL THEN true ELSE false END AS "isInBucket"
      FROM public."SonminsuItems" AS I
      LEFT JOIN public."BucketItems" AS BI ON I.id = BI.item_id
      LEFT JOIN public."Buckets" AS B ON BI.bucket_id = B.id AND B.user_id = ${userId}
      LEFT JOIN public."Feeds" AS F ON I.feed_id = F.id
      WHERE ((I.feed_id IS NOT NULL AND F.deleted_at IS NULL) OR (I.answer_id IS NOT NULL AND I.registration IS true))
      ORDER BY I.created_at DESC
      LIMIT ${perPage} OFFSET ${perPage * (page - 1)}
    `;

    const totalCount = await this.prisma.sonminsuItems.count({
      where: {
        OR: [
          {
            feedId: { not: null },
            feed: {
              deletedAt: null,
            },
          },
          {
            answerId: { not: null },
            registration: true,
          },
        ],
      },
    });

    return {
      data: results.map(({ isInBucket, ...result }) => ({
        isInBucket,
        ...result,
      })),
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async getSonminsuItemsBySearch(searchSonminsuItemDto: SearchSonminsuItemDto) {
    const { search, page, perPage } = searchSonminsuItemDto;

    const itemSearchWhere: Prisma.SonminsuItemsWhereInput = {
      AND: [
        {
          OR: [
            {
              title: {
                contains: search,
              },
            },
            {
              groupName: {
                contains: search,
              },
            },
            {
              artistName: {
                contains: search,
              },
            },
            {
              answer: {
                request: {
                  groupName: {
                    contains: search,
                  },
                },
              },
            },
            {
              answer: {
                request: {
                  artistName: {
                    contains: search,
                  },
                },
              },
            },
            {
              feed: {
                groupName: {
                  contains: search,
                },
              },
            },
            {
              feed: {
                artistName: {
                  contains: search,
                },
              },
            },
          ],
        },
        {
          OR: [
            {
              feedId: { not: null },
              feed: {
                deletedAt: null,
              },
            },
            {
              answerId: { not: null },
              registration: true,
            },
          ],
        },
      ],
    };

    const result = await this.prisma.sonminsuItems.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where: itemSearchWhere,
      orderBy: {
        createdAt: 'desc',
      },
      select: this.selectField,
    });

    const totalCount = await this.prisma.sonminsuItems.count({
      where: itemSearchWhere,
    });

    return {
      data: result.map(this.transformData),
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async getSonminsuItemById(id: number) {
    const item = await this.prisma.sonminsuItems.findUnique({
      where: {
        id,
      },
      select: this.selectField,
    });

    return { data: this.transformData(item) };
  }

  private readonly transformData = ({ feed, answer, ...data }) => ({
    ...data,
    groupName: data.groupName || feed?.groupName || answer?.request?.groupName,
    artistName:
      data.artistName || feed?.artistName || answer?.request?.artistName,
  });

  private readonly selectField = {
    id: true,
    originUrl: true,
    imgUrl: true,
    title: true,
    price: true,
    groupName: true,
    artistName: true,
    feed: {
      select: {
        groupName: true,
        artistName: true,
      },
    },
    answer: {
      select: {
        request: {
          select: {
            groupName: true,
            artistName: true,
          },
        },
      },
    },
  };
}
