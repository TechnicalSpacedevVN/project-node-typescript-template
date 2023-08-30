import { User } from "@/user/type";
import { Document } from "mongoose";
import { Socket } from "socket.io";
export interface SocketAuth extends Socket {
  userId: string;
  user: Document<{}, any, User>;
}

export interface Message {
  content: string;
  sender: string;
  conversation: string;
}

export interface CreateMessageInput {
  content: string;
  conversation: string;
}
