import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { RedisService } from '@redis/redis.service';
import { SendVerificationCodeDto } from '@dto/authDto/send-verificationCode.dto';
import { ConfirmVerificationCodeDto } from '@dto/authDto/confirm-verificationCode.dto';
import { CreateAuthDto } from '@dto/authDto/create-auth.dto';
import { SigninDto } from '@dto/authDto/signin.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InitAuthDto } from '@dto/authDto/init-auth.dto';
import { Prisma } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';

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
    private readonly s3: S3Service,
  ) {}

  async sendVerificationCode({ email }: SendVerificationCodeDto) {
    const exUser = await this.prisma.auth.findUnique({
      where: { email },
    });

    if (exUser) {
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
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    await this.prisma.auth.create({
      data: {
        ...createAuthDto,
        password: hashedPassword,
      },
    });
  }

  async signin({ email, password }: SigninDto) {
    const exUser = await this.prisma.auth.findUnique({
      where: {
        email,
      },
      include: {
        users: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (!exUser) {
      throw new BadRequestException();
    }

    const isValidated = await bcrypt.compare(password, exUser.password);

    if (!isValidated) {
      throw new BadRequestException();
    }

    if (!exUser.users.length) {
      const it = await this.createInitToken(exUser);

      return { it };
    }

    const {
      users: [{ id, nickName, introduction, image }],
    } = exUser;

    const token = await this.createTokens(id, email);

    return {
      data: {
        id,
        nickName,
        introduction,
        image,
      },
      token,
    };
  }

  async initInformation(it: string, initDto: InitAuthDto) {
    try {
      const {
        id,
        name,
        email,
        type,
        exp,
      }: {
        id: number;
        name: string;
        email: string;
        type: string;
        exp: number;
      } = await this.jwt.verifyAsync(it);

      if (
        type !== 'init' ||
        !id ||
        !name ||
        !email ||
        exp * 1000 < new Date().getTime()
      ) {
        throw new UnauthorizedException();
      }

      const { file, nickName, introduction } = initDto;

      const result = await this.prisma.auth.update({
        where: {
          id,
        },
        data: {
          users: {
            create: {
              nickName: nickName || name,
              introduction,
              image: file && (await this.s3.uploadImage(file, `users/${id}/`)),
            },
          },
        },
      });

      return await this.createTokens(result.id, email);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async signout(rt: string) {
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

      if (
        exp * 1000 < new Date().getTime() ||
        !checker ||
        checker !== trimedRt
      ) {
        throw new UnauthorizedException();
      }

      await this.redis.delete(key);
    } catch (e) {
      throw new UnauthorizedException();
    }
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

  private async createInitToken({
    id,
    userName: name,
    email,
  }: {
    id: number;
    userName: string;
    email: string;
  }) {
    return await this.jwt.signAsync(
      { type: 'init', id, name, email },
      { expiresIn: 5 * 60 },
    );
  }

  private async createTokens(id: number, email: string) {
    const refreshKey = await bcrypt.hash(email, 10);

    const accessToken = await this.jwt.signAsync(
      { sub: id },
      { expiresIn: (EXPIRE_REFESH_TOKEN * 2) / 1000 },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: id, email, key: refreshKey },
      { expiresIn: (EXPIRE_REFESH_TOKEN * 2) / 1000 },
    );

    await this.redis.set(refreshKey, refreshToken, EXPIRE_REFESH_TOKEN * 2);

    return { at: `Bearer ${accessToken}`, rt: `Bearer ${refreshToken}` };
  }
}
