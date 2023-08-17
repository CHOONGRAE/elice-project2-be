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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  SigninDto,
  ConfirmVerificationCodeDto,
  SendVerificationCodeDto,
} from '@dto/authDto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async signup(@Body() signupDto: CreateAuthDto, @Res() res: Response) {
    const { at, rt } = await this.authService.signup(signupDto);
    return await this.sendToken(res, at, rt);
  }

  @Post('sign-in')
  @HttpCode(204)
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인',
  })
  @ApiResponse({
    status: 204,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패, 아이디 비밀번호 확인 바람',
  })
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    const { at, rt } = await this.authService.signin(signinDto);
    return this.sendToken(res, at, rt);
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
    return await this.checkToken(req, res);
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
    return await this.checkToken(req, res);
  }

  private async checkToken(req: Request, res: Response) {
    const { rt } = req.cookies;

    if (!rt) throw new UnauthorizedException();

    const { at, rt: newRt } = await this.authService.refreshToken(rt);

    return this.sendToken(res, at, newRt);
  }

  private async sendToken(res: Response, at: string, rt: string) {
    res.setHeader('Authorization', at);
    res.cookie('rt', rt, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
    });
    res.end();
  }
}
