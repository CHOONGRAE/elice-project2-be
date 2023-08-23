import { CreateHashTagDto } from '@dto/hashTag/create-hashTag.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class HashTagService {
  constructor(private readonly prisma: PrismaService) {}

  async createHashTags(createHashTags: CreateHashTagDto[]) {
    return await Promise.all(
      createHashTags.map((tag) => this.createHashTag(tag)),
    );
  }

  private async createHashTag({ tag }: CreateHashTagDto) {
    const upsert = await this.prisma.hashTags.upsert({
      where: {
        tag: tag,
      },
      update: {},
      create: {
        tag,
      },
    });

    return upsert.id;
  }
}
