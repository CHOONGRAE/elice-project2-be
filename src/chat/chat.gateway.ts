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
import { RoomType, SocketWithUser } from './type';
import { UserService } from './user.service';
import { MessageService } from './message.service';

@WebSocketGateway(5050, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: [
      'Origin',
      'X-Request-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  },
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
      console.log(user, socket.id);
    } catch {
      throw new WsException('Conflict');
    }
  }

  handleDisconnect(@ConnectedSocket() Socket: Socket) {}

  @SubscribeMessage('bias')
  async handleMessage(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() message: { room: number; content: string },
  ) {
    const { room, content } = message;
    const { userId } = client;

    const newMessage = await this.messageService.createMessage(
      userId,
      room,
      content,
    );

    this.server.to(`room-${room}`).emit('bias', newMessage);
  }

  @SubscribeMessage('rooms')
  async onRooms(@ConnectedSocket() client: SocketWithUser) {
    const rooms = await this.chatService.getRoomsForUser(client.userId);
    return this.server.to(client.id).emit('rooms', rooms);
  }

  @SubscribeMessage('initRoom')
  async onInitRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() rooms: RoomType[],
  ) {
    let checks: any = await Promise.all(
      rooms.map((room) =>
        this.messageService.getReadedMessage(room.id, client.userId),
      ),
    );

    checks = await Promise.all(
      checks.map((check: any, i: number) =>
        check
          ? Promise.resolve(check)
          : this.messageService.createReadedMessage(rooms[i].id, client.userId),
      ),
    );

    const roomsInfo = await Promise.all(
      checks.map((check) => this.chatService.getRoomInfo(check)),
    );

    this.server.to(client.id).emit(
      'roomInfo',
      rooms.map((v, i) => ({ ...v, ...roomsInfo[i] })),
    );
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() room: number,
  ) {
    console.log(room);
    const messages = await this.messageService.findMessagesForRoomByUser(
      room,
      client.userId,
    );
    client.join(`room-${room}`);
    this.server.to(client.id).emit('joinRoom', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() room: number,
  ) {
    client.leave(`room-${room}`);
    console.log(client.rooms);
  }

  @SubscribeMessage('myInfo')
  async onMyinfo(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() room: number,
  ) {
    const isAdmin = await this.userService.checkAdmin(client.userId, room);
    const isJail = await this.userService.checkJail(client.userId, room);
    this.server
      .to(client.id)
      .emit('myInfo', { isAdmin, userId: client.userId, isJail });
  }

  @SubscribeMessage('members')
  async onGetMembers(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() message: { room: number; search?: string },
  ) {
    const members = await this.userService.getMembers(
      message.room,
      client.userId,
      message.search,
    );

    console.log(members);

    this.server.to(client.id).emit('members', members);
  }

  @SubscribeMessage('jail')
  async onJailUser(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() message: { room: number; userId: number },
  ) {
    await this.userService.userToggleJail(
      message.room,
      message.userId,
      client.userId,
    );
  }
}
