import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { ValidateEmailDto } from './dto/validate-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async validateEmail(email: string) {
    const exUser = await this.prisma.users.findMany({
      where: { email },
    });

    if (exUser.length) {
      return exUser;
    }

    await this.redis.set(email, 'test2');
    return await this.redis.get(email);
  }

  async validate(validateEmail: ValidateEmailDto) {
    const { email, certificationString } = validateEmail;

    const isValidate = (await this.redis.get(email)) === certificationString;

    if (!isValidate) {
      return false;
    }
  }
}
