import { SubscribeMessage } from "@/common/core/decorator";
import { Socket } from "socket.io";

export class NotificationSocket {
  @SubscribeMessage("noti")
  noti(client: Socket, payload: any) {}
}
