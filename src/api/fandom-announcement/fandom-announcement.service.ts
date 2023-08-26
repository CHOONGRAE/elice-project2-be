import { CreateFandomAnnouncementDto } from '@dto/fandomAnnouncement/create-announcement.dto';
import { UpdateFandomAnnouncementDto } from '@dto/fandomAnnouncement/update-announcement.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

const filter = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

@Injectable()
export class FandomAnnouncementService {
  constructor(private readonly prisma: PrismaService) {}

  async createFandomAnnouncement(
    userId: number,
    createFandomAnnouncementDto: CreateFandomAnnouncementDto,
  ) {
    const createdFandomAnnouncement =
      await this.prisma.fandomAnnouncements.create({
        data: {
          userId,
          ...createFandomAnnouncementDto,
        },
        select: {
          id: true,
          author: {
            select: {
              id: true,
              nickName: true,
              image: true,
            },
          },
          fandom: {
            select: {
              id: true,
              fandomName: true,
            },
          },
          content: true,
          createdAt: true,
        },
      });

    return createdFandomAnnouncement;
  }

  async updateFandomAnnouncement(
    id: number,
    updateFandomAnnouncementDto: UpdateFandomAnnouncementDto,
  ) {
    const updatedFandomAnnouncement =
      await this.prisma.fandomAnnouncements.update({
        where: { id },
        data: updateFandomAnnouncementDto,
        select: {
          id: true,
          author: {
            select: {
              id: true,
              nickName: true,
              image: true,
            },
          },
          fandom: {
            select: {
              id: true,
              fandomName: true,
            },
          },
          content: true,
          createdAt: true,
        },
      });

    return updatedFandomAnnouncement;
  }

  async deleteFandomAnnouncement(id: number) {
    await this.prisma.fandomAnnouncements.update({
      where: { id },
      data: {
        deletedAt: new Date().toISOString(),
      },
    });
  }

  async getFandomAnnouncementById(id: number) {
    const result = await this.prisma.fandomAnnouncements.findUnique({
      where: {
        id,
        deletedAt: {
          not: null,
        },
      },
      select: {
        id: true,
        author: {
          select: {
            id: true,
            nickName: true,
            image: true,
          },
        },
        fandom: {
          select: {
            id: true,
            fandomName: true,
          },
        },
        content: true,
        createdAt: true,
      },
    });

    return result;
  }
}
