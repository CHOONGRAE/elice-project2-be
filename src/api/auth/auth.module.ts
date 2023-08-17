import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    global: true,
    secret: config.get('JWT_SECRET') || 'secret',
    signOptions: { expiresIn: '1m' },
  }),
});
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PrismaModule, jwtModule],
  exports: [jwtModule],
})
export class AuthModule {}
