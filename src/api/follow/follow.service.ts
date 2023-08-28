import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { FollowDto } from '@dto/followDto/follow.dto';
import { PaginateFollowDto } from '@dto/followDto/paginate-follow.dto';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async getFollows(userId: number, pagination: PaginateFollowDto) {
    const { page, perPage } = pagination;

    const results = await this.prisma.$queryRaw`
      SELECT U.id, U.nick_name AS "nickName", U.profile_image_url AS "image"
      FROM public."Follows" AS F
      LEFT JOIN public."Users" AS U ON U.id = F.follow_id
      WHERE F.user_id = ${userId} AND U.deleted_at IS NULL
      ORDER BY U.nick_name ASC
      LIMIT ${perPage} OFFSET ${perPage * (page - 1)}
    `;

    const totalCount = await this.prisma.follows.count({
      where: {
        userId,
        follow: {
          deletedAt: null,
        },
      },
    });

    return {
      data: results,
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async getFollowers(userId: number, pagination: PaginateFollowDto) {
    const { page, perPage } = pagination;

    const results = await this.prisma.$queryRaw`
      SELECT U.id, U.nick_name AS "nickName", U.profile_image_url AS "image",
      CASE WHEN ME.user_id = ${userId} THEN true ELSE false END AS "isFollow"
      FROM public."Follows" AS F
      LEFT JOIN public."Users" AS U ON U.id = F.user_id
      LEFT JOIN public."Follows" AS ME ON ME.follow_id = U.id
      WHERE F.follow_id = ${userId} AND U.deleted_at IS NULL
      ORDER BY U.nick_name ASC
      LIMIT ${perPage} OFFSET ${perPage * (page - 1)}
    `;

    const totalCount = await this.prisma.follows.count({
      where: {
        followId: userId,
        follower: {
          deletedAt: null,
        },
      },
    });

    return {
      data: results,
      totalPage: Math.ceil(totalCount / perPage),
      currentPage: page,
    };
  }

  async changeFollowStatus(followDto: FollowDto) {
    const check = await this.prisma.follows.findUnique({
      where: {
        userId_followId: followDto,
      },
    });

    if (check) {
      return await this.prisma.follows.delete({
        where: {
          userId_followId: followDto,
        },
      });
    } else {
      return await this.prisma.follows.create({
        data: followDto,
      });
    }
  }
}
