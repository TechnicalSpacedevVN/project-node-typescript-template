import { IoServer, SubscribeMessage } from "@/common/core/decorator";
import { Server, Socket } from "socket.io";
import { CreateMessageInput, SocketAuth } from "./chat.type";
import { User } from "@/user/user.model";
import { Conversation } from "./models/conversation.model";
import { ClientEvent } from "./constant";
import { Message } from "./models/message.model";

let socketIds: any = [];
const room = "room";

export class ChatSocket {
  @IoServer() io!: Server;

  @SubscribeMessage("connection")
  async connection(client: Socket) {}

  @SubscribeMessage("disconnect")
  async disconnect(client: Socket) {}

  @SubscribeMessage("login")
  async login(client: SocketAuth, userId: string) {
    let user = await User.findOne({ _id: userId });
    if (user) {
      client.userId = userId;
      client.user = user;
    }
  }

  @SubscribeMessage("get-conversation")
  async getConversation(client: SocketAuth, userId: string, cb: any) {
    let conversation = await Conversation.findOne({
      $or: [
        { users: [client.user._id, userId] },
        { users: [userId, client.user._id] },
      ],
    });

    if (!conversation) {
      conversation = new Conversation({
        users: [client.user._id, userId],
      });
      await conversation.save();
    }

    conversation = await Conversation.findOne({
      $or: [
        { users: [client.user._id, userId] },
        { users: [userId, client.user._id] },
      ],
    }).populate("users");

    let messages = await Message.find({ conversation: conversation?._id });

    cb?.({ ...conversation?.toObject(), messages });
  }

  @SubscribeMessage("join-room")
  joinRoom(client: SocketAuth, room: string) {
    client.join(room);
  }

  @SubscribeMessage("send-message-to-room")
  async sendMessageToRoom(client: SocketAuth, payload: CreateMessageInput) {
    let message = new Message({
      content: payload.content,
      sender: client.userId,
      conversation: payload.conversation,
    });
    await message.save();
    this.io.to(payload.conversation).emit(ClientEvent.ClientMessage, message);
  }
}
