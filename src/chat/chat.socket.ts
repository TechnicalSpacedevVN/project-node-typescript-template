import { SubscribeMessage, WebsocketServer } from "@/common/core/decorator";
import { Server, Socket } from "socket.io";

export class ChatSocket {
  @WebsocketServer() io!: Server;

  // Lắng nghe một event
  @SubscribeMessage("sendToClient")
  async chatMessage(client: Socket, payload: any) {
    console.log(payload);
  }

  @SubscribeMessage("join room")
  async joinRoom(client: Socket, payload: any) {
    console.log("join room", payload);
  }

  @SubscribeMessage("connection")
  async contection(client: Socket) {
    console.log("new User");
  }

  @SubscribeMessage("connection")
  async contection2(client: Socket) {
    console.log("new User2");
  }
}
