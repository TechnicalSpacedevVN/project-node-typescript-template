import { IoServer, SubscribeMessage } from "@/common/core/decorator";
import { Server, Socket } from "socket.io";
import { ConversationBody, SendMessageBody } from "./chat.type";
import { Conversation } from "./models/conversation.model";
import { User } from "@/user/user.model";
import { Message } from "./models/message.model";
import { ClientEvent } from "./config";

export class ChatSocket {
  @IoServer() private readonly server!: Server;

  @SubscribeMessage("conversation")
  async conversation(client: Socket, body: ConversationBody, cb: Function) {
    let [user1, user2] = body.users;

    let conversation = await Conversation.findOne({
      $or: [
        { users: [user1, user2] },
        {
          users: [user2, user1],
        },
      ],
    }).populate("users");
    if (!conversation) {
      conversation = new Conversation({ users: [user1, user2] });
      await conversation.save();
      conversation = await Conversation.findOne({
        _id: conversation._id,
      }).populate("users");
    }

    let messages = await Message.find({
      conversation: conversation?._id,
    }).populate("sender");

    cb({ ...conversation?.toJSON(), messages });
  }

  @SubscribeMessage("send-to-user")
  async sendToUser(client: Socket, body: SendMessageBody, cb: Function) {
    // this.server.to();
    // console.log("send-to-user", body);
    let sender = await User.findOne({ socketId: client.id });
    let socketId = (await User.findOne({ _id: body.userId }).select("socketId"))
      ?.socketId;

    let message = new Message({
      content: body.content,
      sender: sender?._id,
      conversation: body.conversation,
    });
    await message.save();

    let _message = await Message.findOne({ _id: message._id }).populate(
      "sender"
    );

    if (socketId) {
      this.server.to(socketId).emit(ClientEvent.ReceiverMessage, _message);
    }

    cb(_message);
  }

  @SubscribeMessage("login")
  async login(client: Socket, userId: string) {
    console.log("login", userId);
    await User.updateOne({ _id: userId }, { socketId: client.id });
  }

  @SubscribeMessage("connection")
  connection() {
    console.log("User connected");
  }

  @SubscribeMessage("disconnect")
  disconnect() {
    console.log("User disconnect");
  }
}
