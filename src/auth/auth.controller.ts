import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, SigninDto, VerificateCodeDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verificationCode')
  @ApiOperation({
    summary: '메일 인증 번호 생성 API',
    description: '메일로 인증 번호를 전송',
  })
  async getVerificationCode(@Query('email') email: string) {
    return await this.authService.getVerificationCode(email);
  }

  @Post('verificationCode')
  @ApiOperation({
    summary: '메일 인증 번호 확인 API',
    description: '메일로 전송된 인증 번호가 일치하는지 확인',
  })
  async confimVerificationCode(@Body() verificateCodeDto: VerificateCodeDto) {
    return await this.authService.confirmVerificationCode(verificateCodeDto);
  }

  @Post('signin')
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인',
  })
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto);
  }

  @Post('signup')
  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입',
  })
  async signup(@Body() signupDto: CreateAuthDto) {
    return await this.authService.signup(signupDto);
  }
}
