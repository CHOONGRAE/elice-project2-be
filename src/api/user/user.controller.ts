import { AuthGuard } from '@guards/auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@decorator/User.decorator';
import { UpdateUserDto } from '@dto/userDto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: '/',
  version: '1',
})
@ApiTags('Users API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('fesfosfos/:userId')
  @ApiOperation({
    summary: '피드 팔로우 팔로워 수',
  })
  async getFesFosFos(@Param('userId') userId: number) {
    return await this.userService.getFesFosFos(userId);
  }

  @Get('users/profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: '프로필 정보 가져오기',
  })
  async getProfile(@User() id: number) {
    return await this.userService.getProfile(id);
  }

  @Patch('users/profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (/image/i.test(file.mimetype)) {
          file.originalname = Buffer.from(file.originalname, 'latin1').toString(
            'utf-8',
          );
          cb(null, true);
        } else cb(new BadRequestException(), true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '프로필 정보 수정',
  })
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @User() id: number,
  ) {
    return this.userService.updateProfile(id, { file, ...updateUserDto });
  }

  @Get('users/authInfo')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: '개인 정보 가져오기',
  })
  async getAuthInfo() {}

  @Patch('users/authInfo')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: '개인 정보 수정',
  })
  async updateAuthInfo() {}

  @Post('users/password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: '비밀 번호 확인',
  })
  async checkPassword() {}

  @Put('users/password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: '비밀 번호 변경',
  })
  async updatePassword() {}
}
