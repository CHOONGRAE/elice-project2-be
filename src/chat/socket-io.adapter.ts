import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
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
    };

    if (process.env.NODE_ENV === 'development') {
      optionsWithCORS.cors = {
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
      };
    }

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.of(/\/thief-.+/).use((socket: SocketWithId, next: NextFunction) => {
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
