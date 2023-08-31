import { HashTagService } from '@api/hash-tag/hash-tag.service';
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

    const [{ images, tags, _count, ...createdFeed }] =
      await this.prisma.$transaction([
        this.prisma.feeds.create({
          data: {
            userId,
            fandomId,
            content,
            groupName,
            artistName,
            images: {
              create: {
                url: await this.s3.uploadImage(
                  image,
                  `feeds/author-${userId}/`,
                ),
              },
            },
            tags: {
              create: await this.createHashTags(hashTags || []),
            },
            sonminsuItems: {
              connect: (sonminsuItems || []).map((id) => ({ id })),
            },
          },
          select: this.selectField,
        }),
        this.prisma.sonminsuItems.updateMany({
          where: {
            id: { in: sonminsuItems || [] },
          },
          data: {
            groupName,
            artistName,
          },
        }),
        this.prisma.fandomRanks.update({
          where: {
            fandomId,
          },
          data: {
            point: {
              increment: 2,
            },
          },
        }),
      ]);

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
    const { content, hashTags } = updateFeedDto;

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
        },
        select: this.selectField,
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

    const results = await this.prisma.feeds.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where: {
        deletedAt: null,
        author: {
          deletedAt: null,
        },
      },
      select: this.selectField,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await this.prisma.feeds.count({
      where: {
        deletedAt: null,
        author: {
          deletedAt: null,
        },
      },
    });

    return {
      data: results.map(({ images, tags, _count, ...result }) => ({
        ...result,
        image: images[0].url,
        tags: tags.map(({ hashTag }) => hashTag.tag),
        comments: _count.comments,
      })),
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async getFeedsByUser(userId: number, pagination: PaginateFeedDto) {
    const { page, perPage } = pagination;

    //     const feeds = await this.prisma.$queryRaw`
    //     SELECT f.* FROM public."Feeds" as f
    //     LEFT JOIN public."Subscribes" s ON f."fandom_id" = s."fandom_id"
    // WHERE s."user_id" IS NULL OR s."user_id" != ${userId}
    // ORDER BY CASE WHEN s."user_id" = ${userId} THEN 1 ELSE 0 END DESC,
    //     f."created_at" DESC;
    //     `;
    //     return feeds;

    const totalCount = await this.prisma.feeds.count({
      where: {
        userId: { not: userId },
        deletedAt: null,
      },
    });

    const { orderBy, orderDir } = this.randomOrder();

    const results = await this.prisma.feeds.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where: {
        userId: { not: userId },
        deletedAt: null,
      },
      select: {
        ...this.selectField,
        likes: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        [orderBy]: orderDir,
      },
    });

    return {
      data: results.map(({ images, tags, _count, likes, ...result }) => ({
        ...result,
        image: images[0].url,
        tags: tags.map(({ hashTag }) => hashTag.tag),
        comments: _count.comments,
        likes: _count.likes,
        isLike: !!likes.length,
      })),
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async getFeedsByAuthor(userId: number, pagination: PaginateFeedDto) {
    const { page, perPage } = pagination;

    const results = await this.prisma.feeds.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where: {
        userId,
        deletedAt: null,
        author: {
          deletedAt: null,
        },
      },
      select: this.selectField,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await this.prisma.feeds.count({
      where: {
        userId,
        deletedAt: null,
        author: {
          deletedAt: null,
        },
      },
    });

    return {
      data: results.map(({ images, tags, _count, ...result }) => ({
        ...result,
        image: images[0].url,
        tags: tags.map(({ hashTag }) => hashTag.tag),
        comments: _count.comments,
        likes: _count.likes,
      })),
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async getFeedsByFandom(fandomId: number, pagination: PaginateFeedDto) {
    const { page, perPage } = pagination;

    console.log(fandomId);

    const results = await this.prisma.feeds.findMany({
      skip: perPage * (page - 1),
      take: perPage,
      where: {
        fandomId,
        deletedAt: null,
        author: {
          deletedAt: null,
        },
      },
      select: this.selectField,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await this.prisma.feeds.count({
      where: {
        fandomId,
        deletedAt: null,
        author: {
          deletedAt: null,
        },
      },
    });

    return {
      data: results.map(({ images, tags, _count, ...result }) => ({
        ...result,
        image: images[0].url,
        tags: tags.map(({ hashTag }) => hashTag.tag),
        comments: _count.comments,
      })),
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async getFeedById(id: number) {
    const { images, tags, _count, ...feed } =
      await this.prisma.feeds.findUnique({
        where: {
          id,
          deletedAt: null,
          author: {
            deletedAt: null,
          },
        },
        select: { ...this.selectField, groupName: true, artistName: true },
      });

    return {
      data: {
        ...feed,
        image: images[0].url,
        tags: tags.map(({ hashTag }) => hashTag.tag),
        comments: _count.comments,
      },
    };
  }

  async getFeedByIdForUser(id: number, userId: number) {
    const { images, tags, _count, likes, ...feed } =
      await this.prisma.feeds.findUnique({
        where: {
          id,
          deletedAt: null,
          author: {
            deletedAt: null,
          },
        },
        select: {
          ...this.selectField,
          groupName: true,
          artistName: true,
          likes: {
            where: {
              userId,
            },
          },
        },
      });

    return {
      data: {
        ...feed,
        image: images[0].url,
        tags: tags.map(({ hashTag }) => hashTag.tag),
        comments: _count.comments,
        likes: _count.likes,
        isLike: !!likes.length,
      },
    };
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

  private readonly selectField = {
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
        originUrl: true,
        imgUrl: true,
        title: true,
        price: true,
      },
    },
    _count: {
      select: {
        comments: {
          where: {
            deletedAt: null,
          },
        },
        likes: true,
      },
    },
  };

  private randomOrder() {
    const randomPick = (values: string[]) => {
      const index = Math.floor(Math.random() * values.length);
      return values[index];
    };

    const orderBy = randomPick(['id', 'userId', 'content', 'createdAt']);
    const orderDir = randomPick([`asc`, `desc`]);

    return { orderBy, orderDir };
  }
}
