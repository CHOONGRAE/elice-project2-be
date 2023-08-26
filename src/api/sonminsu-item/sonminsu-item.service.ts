import { CreateSonminsuItemDto } from '@dto/sonminsuItemDto/create-sonminsuItem.dto';
import { PaginateSonminsuItemDto } from '@dto/sonminsuItemDto/paginate-sonminsuItem.dto';
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
    });
    return {
      id: result.id,
      img: result.imgUrl,
      title: result.title,
      price: result.price,
      originUrl: result.originUrl,
    };
  }

  async updateSonminsuItem(
    id: number,
    updateSonminsuItemDto: UpdateSonminsuItemDto,
  ) {
    const result = await this.prisma.sonminsuItems.update({
      where: { id },
      data: updateSonminsuItemDto,
    });

    return result;
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
      where: {
        registration: false,
      },
      skip: perPage * (page - 1),
      take: perPage,
    });

    return result;
  }
}
