import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import {
  CreateAuthDto,
  SendVerificationCodeDto,
  SigninDto,
  ConfirmVerificationCodeDto,
} from './dto';
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

const EXPIRE_VEIRIFICATION_CODE = 1000 * 60 * 5;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly mailer: MailerService,
    private readonly jwt: JwtService,
  ) {}

  async sendVerificationCode({ email }: SendVerificationCodeDto) {
    const exUser = await this.prisma.users.findMany({
      where: { email },
    });

    if (exUser.length) {
      throw new ConflictException();
    }

    const verificationCode = createCode();

    const hashedCode = await bcrypt.hash(verificationCode, 10);

    await this.mailer.sendMail(email, verificationCode);

    await this.redis.set(email, hashedCode, EXPIRE_VEIRIFICATION_CODE);
  }

  async confirmVerificationCode({ email, code }: ConfirmVerificationCodeDto) {
    const hashedCode = (await this.redis.get(email)) as string;

    const isVerificated = await bcrypt.compare(code, hashedCode);

    if (!isVerificated) {
      throw new ConflictException();
    }

    await this.redis.delete(email);
  }

  async signup(createAuthDto: CreateAuthDto) {
    const { email, password, userName, birthDate, phoneNumber } = createAuthDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
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

    return await this.createTokens(id, email);
  }

  async refreshToken(rt: string) {
    const trimedRt = rt.replace(/bearer/i, '').trim();

    try {
      const {
        sub,
        email,
        key,
        exp,
      }: { sub: number; email: string; key: string; exp: number } =
        await this.jwt.verifyAsync(trimedRt);

      const checker = (await this.redis.get(key)) as string;
      console.log(checker, sub, email, key, exp);

      if (
        exp * 1000 < new Date().getTime() ||
        !checker ||
        checker !== trimedRt
      ) {
        throw new UnauthorizedException();
      }
      await this.redis.delete(key);
      return await this.createTokens(sub, email);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async createTokens(id: number, email: string) {
    const refreshKey = await bcrypt.hash(email, 10);

    const accessToken = await this.jwt.signAsync({ sub: id });

    const refreshToken = await this.jwt.signAsync(
      { sub: id, email, key: refreshKey },
      { expiresIn: (EXPIRE_REFESH_TOKEN * 2) / 1000 },
    );

    await this.redis.set(refreshKey, refreshToken, EXPIRE_REFESH_TOKEN * 2);

    return { at: `Bearer ${accessToken}`, rt: `Bearer ${refreshToken}` };
  }
}
