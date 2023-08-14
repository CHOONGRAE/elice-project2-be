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
import { ValidateEmailDto } from './dto/validate-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('validate')
  async validateEmail(@Query('email') email: string) {
    return await this.authService.validateEmail(email);
  }

  @Post('validate')
  async validate(@Body() validateEmail: ValidateEmailDto) {
    return await this.authService.validate(validateEmail);
  }
}
