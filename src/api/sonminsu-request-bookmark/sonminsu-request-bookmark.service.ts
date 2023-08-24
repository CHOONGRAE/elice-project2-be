import { SonminsuRequestBookmarkDto } from '@dto/sonminsuRequestBookmarkDto/sonminsuRequestBookmark.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class SonminsuRequestBookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async changeSonminsuRequestBookmarkStatus(
    sonminsuRequestBookmarkDto: SonminsuRequestBookmarkDto,
  ) {
    const check = await this.prisma.sonminsuRequestBookmarks.findUnique({
      where: {
        userId_requestId: sonminsuRequestBookmarkDto,
      },
    });

    if (check) {
      return await this.prisma.sonminsuRequestBookmarks.delete({
        where: {
          userId_requestId: sonminsuRequestBookmarkDto,
        },
      });
    } else {
      return await this.prisma.sonminsuRequestBookmarks.create({
        data: sonminsuRequestBookmarkDto,
      });
    }
  }
}
