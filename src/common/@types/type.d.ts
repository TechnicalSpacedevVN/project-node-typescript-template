import { Socket } from "socket.io";

export interface AuthContext {
  user: string;
}

export type SubscribeMessageFunc = (socket: Socket, ...args: any[]) => void;
