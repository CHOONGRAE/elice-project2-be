import { JwtModule as jwt } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const JwtModule = jwt.registerAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    secret: config.get('JWT_SECRET') || 'secret',
    signOptions: { expiresIn: '1m' },
  }),
});

JwtModule.global = true;
