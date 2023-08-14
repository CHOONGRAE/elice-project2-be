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
import { VerificateCodeDto } from './dto';

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
}
