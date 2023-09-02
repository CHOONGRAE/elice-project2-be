import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  Res,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SendVerificationCodeDto } from '@dto/authDto/send-verificationCode.dto';
import { ConfirmVerificationCodeDto } from '@dto/authDto/confirm-verificationCode.dto';
import { CreateAuthDto } from '@dto/authDto/create-auth.dto';
import { SigninDto } from '@dto/authDto/signin.dto';
import { InitAuthDto } from '@dto/authDto/init-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthKakaoService } from './kakao/auth.kakao.service';
import { AuthGoogleService } from './google/auth.google.service';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly kakaoService: AuthKakaoService,
    private readonly googleService: AuthGoogleService,
  ) {}

  @Post('sign-in/kakao')
  async siginInKakao(
    @Body() data: { code: string; domain: string },
    @Res() res: Response,
  ) {
    const result = await this.kakaoService.signInKakao(data);

    const {
      data: info,
      token: { at, rt },
    } = result;

    this.setToken(res, at, rt);

    return res.json(info);
  }

  @Post('sign-in/google')
  async siginInGoogle(
    @Body() data: { code: string; domain: string },
    @Res() res: Response,
  ) {
    const result = await this.googleService.signInGoogle(data);

    const {
      data: info,
      token: { at, rt },
    } = result;

    this.setToken(res, at, rt);

    return res.json(info);
  }

  @Get('verification-code')
  @HttpCode(204)
  @ApiOperation({
    summary: '메일 인증 번호 생성 API',
    description: '메일로 인증 번호를 전송',
  })
  @ApiResponse({
    status: 204,
    description: '요청 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - value 확인바람',
  })
  @ApiResponse({
    status: 409,
    description: '이미 가입한 email',
  })
  async sendVerificationCode(
    @Query() sendVerificationCodeDto: SendVerificationCodeDto,
  ) {
    return await this.authService.sendVerificationCode(sendVerificationCodeDto);
  }

  @Post('verification-code')
  @HttpCode(200)
  @ApiOperation({
    summary: '메일 인증 번호 확인 API',
    description: '메일로 전송된 인증 번호가 일치하는지 확인',
  })
  @ApiResponse({
    status: 200,
    description: '요청 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - value 확인바람',
  })
  @ApiResponse({
    status: 409,
    description: '인증 번호 불일치',
  })
  async confimVerificationCode(
    @Body() confirmVerificationCodeDto: ConfirmVerificationCodeDto,
  ) {
    return await this.authService.confirmVerificationCode(
      confirmVerificationCodeDto,
    );
  }

  @Post('sign-up')
  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입',
  })
  @ApiResponse({
    status: 201,
    description: '회원 가입 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - value 확인바람',
  })
  async signup(@Body() signupDto: CreateAuthDto) {
    await this.authService.signup(signupDto);
  }

  @Post('sign-in')
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 204,
    description: '로그인 성공 - 초기화 필요',
  })
  @ApiResponse({
    status: 400,
    description: '로그인 실패, 아이디 비밀번호 확인 바람',
  })
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    const result = await this.authService.signin(signinDto);

    if (!result.data) {
      const { it } = result;

      res.cookie('it', it, {
        httpOnly: true,
        maxAge: 1000 * 60 * 5,
      });

      return res.status(204).end();
    }

    const {
      data,
      token: { at, rt },
    } = result;

    this.setToken(res, at, rt);

    return res.json(data);
  }

  @Post('init-info')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (/image/i.test(file.mimetype)) {
          file.originalname = Buffer.from(file.originalname, 'latin1').toString(
            'utf-8',
          );
          cb(null, true);
        } else cb(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: '유저 정보 초기 설정',
  })
  async initInformation(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() initDto: InitAuthDto,
  ) {
    const { it } = req.cookies;

    if (!it) throw new UnauthorizedException();

    const result = await this.authService.initInformation(it, {
      file,
      ...initDto,
    });

    const {
      data,
      token: { at, rt },
    } = result;

    this.setToken(res, at, rt);

    res.clearCookie('it');

    return res.json(data);
  }

  @Delete('sign-out')
  @ApiOperation({
    summary: '로그아웃',
  })
  async signout(@Req() req: Request, @Res() res: Response) {
    const { rt } = req.cookies;

    if (!rt) throw new UnauthorizedException();

    await this.authService.signout(rt);

    res.clearCookie('rt').end();
  }

  @Get('auto-sign-in')
  @HttpCode(204)
  @ApiOperation({
    summary: '자동 로그인',
    description: '앱 구동시 토큰으로 로그인',
  })
  @ApiResponse({
    status: 204,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패 토큰 만료',
  })
  async autoSignin(@Req() req: Request, @Res() res: Response) {
    await this.checkToken(req, res);

    return res.end();
  }

  @Get('refresh-token')
  @HttpCode(204)
  @ApiOperation({
    summary: 'jwt token 리프레시 API',
    description: 'jwt token 리프레시 하기',
  })
  @ApiResponse({
    status: 204,
    description: '갱신 성공',
  })
  @ApiResponse({
    status: 401,
    description: '토큰 만료',
  })
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    await this.checkToken(req, res);

    return res.end();
  }

  private async checkToken(req: Request, res: Response) {
    const { rt } = req.cookies;

    if (!rt) throw new UnauthorizedException();

    const { at, rt: newRt } = await this.authService.refreshToken(rt);

    return this.setToken(res, at, newRt);
  }

  private setToken(res: Response, at: string, rt: string) {
    res.setHeader('Authorization', at);
    res.cookie('rt', rt, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
    });
  }
}
