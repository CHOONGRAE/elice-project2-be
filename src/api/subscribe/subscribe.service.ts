import { SubscribeDto } from '@dto/subscribe/subscribe.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class SubscribeService {
  constructor(private readonly prisma: PrismaService) {}

  async changeLikeStatus(subscribeDto: SubscribeDto) {
    const check = await this.prisma.subscribes.findUnique({
      where: {
        userId_fandomId: subscribeDto,
      },
    });

    if (check) {
      return await this.prisma.subscribes.delete({
        where: {
          userId_fandomId: subscribeDto,
        },
      });
    } else {
      return await this.prisma.subscribes.create({
        data: subscribeDto,
      });
    }
  }
}
