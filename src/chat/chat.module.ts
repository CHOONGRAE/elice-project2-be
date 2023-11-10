import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { UserService } from './user.service';
import { RedisModule } from '@redis/redis.module';
import { ChatController } from './chat.controller';
import { S3Module } from '@s3';

@Module({
  imports: [RedisModule, S3Module],
  providers: [ChatService, MessageService, UserService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
