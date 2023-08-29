import { UpdateUserDto } from '@dto/userDto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async getFesFosFos(userId) {
    const feeds = await this.prisma.feeds.count({
      where: {
        userId,
        deletedAt: null,
        author: {
          deletedAt: null,
        },
      },
    });

    const follows = await this.prisma.follows.count({
      where: {
        userId,
        follow: {
          deletedAt: null,
        },
        follower: {
          deletedAt: null,
        },
      },
    });

    const followers = await this.prisma.follows.count({
      where: {
        followId: userId,
        follow: {
          deletedAt: null,
        },
        follower: {
          deletedAt: null,
        },
      },
    });

    return { data: { feeds, follows, followers } };
  }

  async getProfile(id: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        nickName: true,
        introduction: true,
        image: true,
      },
    });

    return { data: user };
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    const { nickName, introduction, file } = updateUserDto;

    const user = await this.prisma.users.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        nickName,
        introduction,
        image: file && (await this.s3.uploadImage(file, `users/${id}/`)),
      },
      select: {
        id: true,
        nickName: true,
        introduction: true,
        image: true,
      },
    });

    return { data: user };
  }
}
