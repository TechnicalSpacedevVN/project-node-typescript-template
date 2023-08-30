import { SubscribeMessageFunc } from "@/common/@types/type";
import { SubscribeMessage, WebsocketServer } from "@/common/core/decorator";
import { Server, Socket } from "socket.io";

export class NotificationSocket {
  @WebsocketServer() io!: Server;

  @SubscribeMessage("connection")
  connection(client: Socket) {
    console.log("NotificationSocket setup");
  }
}
