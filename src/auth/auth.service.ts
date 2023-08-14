import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateAuthDto, SigninDto, VerificateCodeDto } from './dto';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

const createPrefix = () =>
  ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

const createRandomNumber = () =>
  String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

const createCode = () => `${createPrefix()}-${createRandomNumber()}`;

const EXPIRE_REFESH_TOKEN = 1000 * 60 * 60 * 24 * 7;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly mailer: MailerService,
    private readonly jwt: JwtService,
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

  async signup({
    email,
    password,
    userName,
    birthDate,
    phoneNumber,
  }: CreateAuthDto) {
    return await this.prisma.users.create({
      data: {
        email,
        password,
        userMeta: {
          create: {
            userName,
            birthDate,
            phoneNumber,
          },
        },
      },
    });
  }

  async signin({ email, password }: SigninDto) {
    const exUser = await this.prisma.users.findMany({
      where: { email },
    });

    if (!exUser.length) {
      throw new UnauthorizedException();
    }

    const { id, password: hashedPassword } = exUser[0];

    const isValidated = await bcrypt.compare(password, hashedPassword);

    if (!isValidated) {
      throw new UnauthorizedException();
    }

    const refreshKey = await bcrypt.hash(email, 10);

    const payload = { sub: id, refreshKey };

    const accessToken = await this.jwt.signAsync(payload);

    const refreshToken = await this.jwt.signAsync(
      { sub: id },
      { expiresIn: EXPIRE_REFESH_TOKEN * 2 },
    );

    await this.redis.set(refreshKey, refreshToken, EXPIRE_REFESH_TOKEN * 2);

    return { access_token: accessToken };
  }
}
