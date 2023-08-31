import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { NextFunction } from 'express';
import { WsException } from '@nestjs/websockets';
import { SocketWithId } from './type';

export class SocketIoAdapter extends IoAdapter {
  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const jwt = this.app.get(JwtService);

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors: 'localhost:3000',
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server
      .of('thief-sonminsu')
      .use((socket: SocketWithId, next: NextFunction) => {
        const token = socket.handshake.headers.authorization
          .replace(/bearer/i, '')
          .trim();

        try {
          const payload = jwt.verify(token);
          if (payload.exp * 1000 < new Date().getTime()) {
            new WsException('FORBIDDEN');
          }
          socket.userId = payload.sub;
          next();
        } catch {
          next(new WsException('FORBIDDEN'));
        }
      });

    return server;
  }
}
