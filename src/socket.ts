import { ChatSocket } from "./chat/chat.socket";
import { SocketServer } from "./common/core/decorator/socket";
import { NotificationSocket } from "./notification/notification.socket";

@SocketServer({
  providers: [ChatSocket, NotificationSocket],
  cors: {
    origin: [
      "https://admin.socket.io",
      "http://127.0.0.1:5501",
      "http://localhost:5501",
      "http://localhost:3000",
    ],
    credentials: true,
  },
  admin: {
    auth: {
      type: "basic",
      username: "admin",
      password: "$2a$10$dGKeT5x7EJ.Y9NyMqmqMmuC43UQ8/dhIvIvn5q.iDTUcqbyy2LcMa",
    },
    mode: "development",
  },
})
export class SocketApp {}
