import { HashTagService } from '@api/hash-tag/hash-tag.service';
import { SonminsuItemService } from '@api/sonminsu-item/sonminsu-item.service';
import { CreateFeedDto } from '@dto/feedDto/create-feed.dto';
import { PaginateFeedDto } from '@dto/feedDto/paginate-feed.dto';
import { UpdateFeedDto } from '@dto/feedDto/update-feed.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly sonminsuItem: SonminsuItemService,
    private readonly hashTag: HashTagService,
  ) {}

  async createFeed(userId: number, createFeedDto: CreateFeedDto) {
    const {
      fandomId,
      content,
      groupName,
      artistName,
      hashTags,
      image,
      sonminsuItems,
    } = createFeedDto;

    const { images, tags, _count, ...createdFeed } =
      await this.prisma.feeds.create({
        data: {
          userId,
          fandomId,
          content,
          groupName,
          artistName,
          images: {
            create: {
              url: await this.s3.uploadImage(image, `feeds/author-${userId}/`),
            },
          },
          tags: {
            create: await this.createHashTags(hashTags || []),
          },
          sonminsuItems: {
            connect: (sonminsuItems || []).map((id) => ({ id })),
          },
        },
        select: {
          id: true,
          content: true,
          images: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              image: true,
              nickName: true,
            },
          },
          fandom: {
            select: {
              id: true,
              fandomName: true,
            },
          },
          tags: {
            select: {
              hashTag: {
                select: {
                  tag: true,
                },
              },
            },
          },
          sonminsuItems: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              comments: {
                where: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      });

    return {
      data: {
        ...createdFeed,
        image: images[0].url,
        tags: tags.map(({ hashTag }) => hashTag.tag),
        comments: _count.comments,
      },
    };
  }

  async updateFeed(
    userId: number,
    feedId: number,
    updateFeedDto: UpdateFeedDto,
  ) {
    const { content, hashTags, sonminsuItems } = updateFeedDto;

    const { images, tags, _count, ...updatedFeed } = await this.prisma.feeds
      .update({
        where: {
          id: feedId,
          userId,
          deletedAt: null,
        },
        data: {
          content,
          tags: {
            deleteMany: {},
            create: await this.createHashTags(hashTags || []),
          },
          sonminsuItems: {
            connect: (sonminsuItems || []).map((id) => ({ id })),
          },
        },
        select: {
          id: true,
          content: true,
          images: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              image: true,
              nickName: true,
            },
          },
          fandom: {
            select: {
              id: true,
              fandomName: true,
            },
          },
          tags: {
            select: {
              hashTag: {
                select: {
                  tag: true,
                },
              },
            },
          },
          sonminsuItems: {
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              comments: {
                where: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new BadRequestException();
      });

    return {
      data: {
        ...updatedFeed,
        image: images[0].url,
        tags: tags.map(({ hashTag }) => hashTag.tag),
        comments: _count.comments,
      },
    };
  }

  async deleteFeed(feedId: number, userId: number) {
    await this.prisma.feeds
      .update({
        where: {
          id: feedId,
          userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date().toISOString(),
        },
      })
      .catch(() => {
        throw new BadRequestException();
      });
  }

  async getFeeds(pagination: PaginateFeedDto) {
    const { page, perPage } = pagination;

    const result = await this.prisma.feeds.findMany({
      skip: perPage * (page - 1),
      take: perPage,
    });

    return result;
  }

  async getFeedsByUser(userId: number, pagination: PaginateFeedDto) {
    const { page, perPage } = pagination;

    const result = await this.prisma.feeds.findMany({
      where: {
        userId,
      },
      skip: perPage * (page - 1),
      take: perPage,
    });

    return result;
  }

  async getFeedsByFandom(fandomId: number, pagination: PaginateFeedDto) {
    const { page, perPage } = pagination;

    const result = await this.prisma.feeds.findMany({
      where: {
        fandomId,
      },
      skip: perPage * (page - 1),
      take: perPage,
    });

    return result;
  }

  async getFeedById(id: number) {
    const feed = await this.prisma.feeds.findUnique({
      where: {
        id,
      },
    });

    return feed;
  }

  private async createHashTags(hashTags: string[]) {
    return (
      await this.hashTag.createHashTags(
        hashTags.map((tag) => ({
          tag,
        })),
      )
    ).map((id) => ({
      hashTagId: id,
    }));
  }
}
