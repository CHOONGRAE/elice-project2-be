import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { S3Module } from '@s3';

@Module({
  imports: [S3Module],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
