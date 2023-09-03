import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthKakaoService } from './kakao/auth.kakao.service';
import { AuthGoogleService } from './google/auth.google.service';
import { OauthDto } from '@dto/authDto/oauth.dto';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Oauth API')
export class OauthController {
  constructor(
    private readonly kakaoService: AuthKakaoService,
    private readonly googleService: AuthGoogleService,
  ) {}

  @Post('sign-in/kakao')
  async siginInKakao(@Body() data: OauthDto, @Res() res: Response) {
    const result = await this.kakaoService.signInKakao(data);

    const {
      data: info,
      token: { at, rt },
    } = result;

    this.setToken(res, at, rt);

    return res.json(info);
  }

  @Post('sign-in/google')
  async siginInGoogle(@Body() data: OauthDto, @Res() res: Response) {
    const result = await this.googleService.signInGoogle(data);

    const {
      data: info,
      token: { at, rt },
    } = result;

    this.setToken(res, at, rt);

    return res.json(info);
  }

  private setToken(res: Response, at: string, rt: string) {
    res.setHeader('Authorization', at);
    res.cookie('rt', rt, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
    });
  }
}
