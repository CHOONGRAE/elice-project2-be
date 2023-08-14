import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateAuthDto, SigninDto, VerificateCodeDto } from './dto';
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

  async getVerificationCode(email: string) {
    const exUser = await this.prisma.users.findMany({
      where: { email },
    });

    if (exUser.length) {
      return false;
    }

    const verificationCode = createCode();

    const hashedCode = await bcrypt.hash(verificationCode, 10);

    await this.mailer.sendMail(email, verificationCode);

    await this.redis.set(email, hashedCode);

    return true;
  }

  async confirmVerificationCode({ email, code }: VerificateCodeDto) {
    const hashedCode = await this.redis.get(email);

    const isVerificated = await bcrypt.compare(code, hashedCode as string);

    if (!isVerificated) {
      return false;
    }

    await this.redis.delete(email);

    return true;
  }

  async signup({ email, password }: CreateAuthDto) {}

  async signin({ email, password }: SigninDto) {
    const exUser = await this.prisma.users.findMany({
      where: { email },
    });

    if (exUser.length) {
      return false;
    }

    const { password: hashedPassword } = exUser[0];

    const isValidated = await bcrypt.compare(password, hashedPassword);

    if (!isValidated) {
      return false;
    }

    return true;
  }
}
