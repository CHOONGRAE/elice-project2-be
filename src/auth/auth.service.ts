import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { VerificateCodeDto } from './dto';
import { MailerService } from 'src/mailer/mailer.service';
import * as bcrypt from 'bcrypt';

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

const createPrefix = () =>
  ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

const createRandomNumber = () =>
  String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

const createCode = () => `${createPrefix()}-${createRandomNumber()}`;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly mailer: MailerService,
  ) {}

  async validateEmail(email: string) {
    const exUser = await this.prisma.users.findMany({
      where: { email },
    });

    if (exUser.length) {
      return false;
    }

    const verificateCode = createCode();

    const hashedCode = await bcrypt.hash(verificateCode, 10);

    await this.mailer.sendMail(email, verificateCode);

    await this.redis.set(email, hashedCode);

    return true;
  }

  async confirmVerificationCode(verificateCode: VerificateCodeDto) {
    const { email, code } = verificateCode;

    const hashedCode = await this.redis.get(email);

    const isVerificate = await bcrypt.compare(code, hashedCode as string);

    if (!isVerificate) {
      return false;
    }

    await this.redis.delete(email);

    return true;
  }
}
