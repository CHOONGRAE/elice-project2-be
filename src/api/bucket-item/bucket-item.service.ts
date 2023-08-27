import { BucketItemDto } from '@dto/bucketItemDto/bucketItem.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class BucketItemService {
  constructor(private readonly prisma: PrismaService) {}

  async changeBucketItemStatus(bucketItemDto: BucketItemDto) {
    const check = await this.prisma.bucketItems.findUnique({
      where: {
        bucketId_itemId: bucketItemDto,
      },
    });

    if (check) {
      return await this.prisma.bucketItems.delete({
        where: {
          bucketId_itemId: bucketItemDto,
        },
      });
    } else {
      return await this.prisma.bucketItems.create({
        data: bucketItemDto,
      });
    }
  }
}
