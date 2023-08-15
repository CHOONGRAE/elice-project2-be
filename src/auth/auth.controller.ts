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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verificationCode')
  async getVerificationCode(@Query('email') email: string) {
    return await this.authService.getVerificationCode(email);
  }

  @Post('verificationCode')
  async confimVerificationCode(@Body() verificateCodeDto: VerificateCodeDto) {
    return await this.authService.confirmVerificationCode(verificateCodeDto);
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto);
  }

  @Post('signup')
  async signup(@Body() signupDto: CreateAuthDto) {
    return await this.authService.signup(signupDto);
  }
}
