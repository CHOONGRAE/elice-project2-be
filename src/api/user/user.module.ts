import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FandomModule } from '@api/fandom/fandom.module';
import { SonminsuRequestModule } from '@api/sonminsu-request/sonminsu-request.module';
import { SonminsuRequestBookmarkModule } from '@api/sonminsu-request-bookmark/sonminsu-request-bookmark.module';
import { SubscribeModule } from '@api/subscribe/subscribe.module';

@Module({
  imports: [
    FandomModule,
    SubscribeModule,
    SonminsuRequestModule,
    SonminsuRequestBookmarkModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
