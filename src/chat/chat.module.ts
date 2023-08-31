import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import { RedisModule } from '@redis/redis.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [RedisModule],
  providers: [ChatService, MessageService, UserService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
