import { LikeDto } from '@dto/likeDto/like.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async changeLikeStatus(likeDto: LikeDto) {
    const check = await this.prisma.likes.findUnique({
      where: {
        userId_feedId: likeDto,
      },
    });

    if (check) {
      return await this.prisma.likes.delete({
        where: {
          userId_feedId: likeDto,
        },
      });
    } else {
      return await this.prisma.likes.create({
        data: likeDto,
      });
    }
  }
}
