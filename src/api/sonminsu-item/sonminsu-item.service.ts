import { CreateSonminsuItemDto } from '@dto/sonminsuItemDto/create-sonminsuItem.dto';
import { PaginateSonminsuItemDto } from '@dto/sonminsuItemDto/paginate-sonminsuItem.dto';
import { SearchSonminsuItemDto } from '@dto/sonminsuItemDto/search-sonminsuItem.dto';
import { UpdateSonminsuItemDto } from '@dto/sonminsuItemDto/update-sonminsuItem.dto';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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

    return { data: result };
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

    return { data: result };
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

    const [result, totalCount] = await this.prisma.$transaction([
      this.prisma.sonminsuItems.findMany({
        skip: Math.max(0, (perPage || 10) * ((page || 1) - 1)),
        take: Math.max(0, perPage || 10),
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
      }),
      this.prisma.sonminsuItems.count({
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
      }),
    ]);

    return {
      data: result,
      totalPage: Math.ceil(totalCount / (perPage || 10)),
      currentPage: page || 1,
    };
  }

  async getSonminsuItemsBySearch(searchSonminsuItemDto: SearchSonminsuItemDto) {
    const { search, page, perPage } = searchSonminsuItemDto;

    const [result, totalCount] = await this.prisma.$transaction([
      this.prisma.sonminsuItems.findMany({
        skip: Math.max(0, (perPage || 10) * ((page || 1) - 1)),
        take: Math.max(0, perPage || 10),
        where: {
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
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: this.selectField,
      }),
      this.prisma.sonminsuItems.count({
        where: {
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
        },
      }),
    ]);

    return {
      data: result,
      totalPage: Math.ceil(totalCount / (perPage || 10)),
      currentPage: page || 1,
    };
  }

  private readonly selectField = {
    id: true,
    originUrl: true,
    title: true,
    price: true,
    imgUrl: true,
    groupName: true,
    artistName: true,
  };
}
