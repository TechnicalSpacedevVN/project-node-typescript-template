import { ChatSocket } from "./chat/chat.socket";
import { SocketServer } from "./common/core/decorator/socket";
import { NotificationSocket } from "./notification/notification.socket";

@SocketServer({
  cors: {
    origin: ["http://localhost:5501", "https://admin.socket.io"],
    credentials: true,
  },
  providers: [ChatSocket, NotificationSocket],
  admin: {
    auth: {
      type: "basic",
      username: "admin",
      password: "$2a$10$DnBAxJkb1PDZi8F2Cgtpj.EPmA.TJYNbDehqzz4Ig.Honjexu4/3q",
    },
    mode: "development",
  },
})
export class SocketApp {}
