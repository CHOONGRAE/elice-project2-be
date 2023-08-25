import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FandomModule } from '@api/fandom/fandom.module';
import { SonminsuRequestModule } from '@api/sonminsu-request/sonminsu-request.module';

@Module({
  imports: [FandomModule, SonminsuRequestModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
