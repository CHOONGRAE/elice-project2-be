import { CreateFandomAnnouncementDto } from '@dto/fandomAnnouncement/create-announcement.dto';
import { UpdateFandomAnnouncementDto } from '@dto/fandomAnnouncement/update-announcement.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

const filter = () =>
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

@Injectable()
export class FandomAnnouncementService {
  constructor(private readonly prisma: PrismaService) {}

  async createFandomAnnouncement(
    userId: number,
    fandomId: number,
    createFandomAnnouncementDto: CreateFandomAnnouncementDto,
  ) {
    const createdFandomAnnouncement =
      await this.prisma.fandomAnnouncements.create({
        data: {
          userId,
          fandomId,
          ...createFandomAnnouncementDto,
        },
        select: this.selectField,
      });

    return { data: createdFandomAnnouncement };
  }

  async updateFandomAnnouncement(
    id: number,
    userId: number,
    updateFandomAnnouncementDto: UpdateFandomAnnouncementDto,
  ) {
    const updatedFandomAnnouncement =
      await this.prisma.fandomAnnouncements.update({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        data: updateFandomAnnouncementDto,
        select: this.selectField,
      });

    return { data: updatedFandomAnnouncement };
  }

  async deleteFandomAnnouncement(id: number, userId: number) {
    await this.prisma.fandomAnnouncements
      .update({
        where: {
          id,
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

  async getFandomAnnouncements() {
    const result = await this.prisma.fandomAnnouncements.findMany({
      where: {
        createdAt: { gte: filter() },
        deletedAt: null,
      },
      select: this.selectField,
    });

    return { data: result };
  }

  async getFandomAnnouncementsById(id: number) {
    const result = await this.prisma.fandomAnnouncements.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: this.selectField,
    });

    return { data: result };
  }

  private readonly selectField = {
    id: true,
    author: {
      select: {
        id: true,
        nickName: true,
        image: true,
      },
    },
    content: true,
    createdAt: true,
  };
}
