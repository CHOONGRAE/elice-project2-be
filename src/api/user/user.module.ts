import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FandomModule } from '@api/fandom/fandom.module';

@Module({
  imports: [FandomModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
