import { Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatGateway: ChatGateway,
  ) {}
  @Post()
  async test() {
    console.log(this.chatGateway.server.in('room-7').emit('test', 'test'));
  }
}
