import { CreateBucketDto } from '@dto/bucketDto/create-bucket.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class BucketService {
  constructor(private readonly prisma: PrismaService) {}

  async createBucket(userId: number, createBucketDto: CreateBucketDto) {
    const { items, ...createdBucket } = await this.prisma.buckets.create({
      data: {
        userId,
        ...createBucketDto,
      },
      select: this.selectField,
    });

    return { data: { createdBucket, img: items[0]?.item?.imgUrl || null } };
  }

  async deleteBucket(id: number, userId: number) {
    await this.prisma.buckets
      .delete({
        where: {
          id,
          userId,
        },
      })
      .catch(() => {
        throw new ConflictException();
      });
  }

  async getBuckets(userId: number) {
    const result = await this.prisma.buckets.findMany({
      where: {
        userId,
      },
      select: this.selectField,
    });

    return {
      data: result.map(({ items, ...v }) => ({
        ...v,
        img: items[0]?.item?.imgUrl || null,
      })),
    };
  }

  async getBucket(id: number, userId: number) {
    const result = await this.prisma.buckets.findUnique({
      where: {
        id,
        userId,
      },
      select: this.detailSelectField,
    });

    return { data: result };
  }

  private readonly selectField = {
    id: true,
    bucketName: true,
    createdAt: true,
    items: {
      select: {
        item: {
          select: {
            imgUrl: true,
          },
        },
      },
    },
  };

  private readonly detailSelectField = {
    id: true,
    bucketName: true,
    createdAt: true,
    items: {
      select: {
        item: {
          select: {
            originUrl: true,
            imgUrl: true,
            title: true,
            price: true,
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
          },
        },
      },
    },
  };
}
