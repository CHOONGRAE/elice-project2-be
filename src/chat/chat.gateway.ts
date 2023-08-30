import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { SocketWithUser } from './type';
import { UserService } from './user.service';
import { MessageService } from './message.service';

@WebSocketGateway(5050, {
  cors: { origin: 'http://localhost:3000' },
  // namespace: /\/thief-.+/,
  namespace: 'thief-sonminsu',
  // cors: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('----------------socket init');
  }

  async handleConnection(@ConnectedSocket() socket: SocketWithUser) {
    try {
      const user = await this.userService.getUser(socket.userId);
      socket.user = user;

      const rooms = await this.chatService.getRoomsForUser(socket.userId);
      return this.server.to(socket.id).emit('rooms', rooms);
    } catch {
      throw new WsException('Conflict');
    }
  }

  handleDisconnect(@ConnectedSocket() Socket: Socket) {}

  @SubscribeMessage('bias')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    console.log(message);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() room: number,
  ) {
    const checker = await this.messageService.readedMessage(
      room,
      client.userId,
    );
    // const messages = await this.messageService.findMessageForRoom(
    //   room,
    //   checker.messageId,
    // );
    // this.server.to(client.id).emit('messages', { room, messages });
  }
}
