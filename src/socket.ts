import { ChatSocket } from "./chat/chat.socket";
import { SocketServer } from "./common/core/decorator";

@SocketServer({
  providers: [ChatSocket],
  cors: {
    origin: "*",
  },
  //   admin: {
  //     auth: {
  //       type: "basic",
  //     },
  //   },
})
export class SocketApp {}
