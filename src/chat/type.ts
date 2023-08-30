import { Socket } from 'socket.io';

export type SocketWithId = Socket & { userId: number };
export type SocketWithUser = SocketWithId & {
  user: {
    nickName: string;
    image: string;
  };
};
