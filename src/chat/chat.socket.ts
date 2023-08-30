import { IoServer, SubscribeMessage } from "@/common/core/decorator";
import { Server, Socket } from "socket.io";

let socketIds: any = [];
const room = "room";

export class ChatSocket {
  @IoServer() io!: Server;

  @SubscribeMessage("connection")
  async connection(client: Socket) {
    socketIds.push(client.id);
  }

  @SubscribeMessage("disconnect")
  async disconnect(client: Socket) {
    socketIds = socketIds.filter((e: any) => e !== client.id);
  }

  @SubscribeMessage("join room")
  async joinRoom(client: Socket, ...payload: any[]) {
    console.log("join room");
    client.join(room);
  }

  @SubscribeMessage("sendToRoom")
  sendToRoom(_: Socket, msg: string) {
    console.log("sendToRoom", room);
    this.io.to(room).emit("client message", msg);
  }

  @SubscribeMessage("message")
  message(client: Socket, msg: string) {
    let socketId = socketIds.find((e: any) => e !== client.id);
    if (socketId) {
      this.io.to(socketId).emit("client message", msg);
    }
  }
}
