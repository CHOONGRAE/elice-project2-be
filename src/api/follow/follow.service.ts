import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { FollowDto } from '@dto/followDto/follow.dto';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

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
