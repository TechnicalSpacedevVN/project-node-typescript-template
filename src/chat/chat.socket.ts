import { IoServer, SubscribeMessage } from "@/common/core/decorator";
import { Server, Socket } from "socket.io";
import {
  ConversationBody,
  SendMessageBody,
  SendToConversationMessageBody,
} from "./chat.type";
import { Conversation } from "./models/conversation.model";
import { User } from "@/user/user.model";
import { Message } from "./models/message.model";
import { ClientEvent, ServerEvent } from "./config";

export class ChatSocket {
  @IoServer() private readonly server!: Server;

  @SubscribeMessage(ServerEvent.Conversation)
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

  @SubscribeMessage(ServerEvent.GetMessages)
  async getMessages(client: Socket, conversationId: string, cb: Function) {
    let messages = await Message.find({
      conversation: conversationId,
    }).populate("sender");
    cb(messages);
  }

  @SubscribeMessage(ServerEvent.ConversationGroup)
  async getConversationGroup(client: Socket, cb: Function) {
    let user = await User.findOne({ socketId: client.id });
    if (user) {
      let conversations = await Conversation.find({
        users: {
          $in: [user.id],
        },
        isGroup: true,
      }).populate("users");

      cb(conversations);
    }
  }

  @SubscribeMessage(ServerEvent.SendToConversation)
  async sendToConversation(
    client: Socket,
    body: SendToConversationMessageBody,
    cb: Function
  ) {
    // this.server.to();
    // console.log("send-to-user", body);
    let sender = await User.findOne({ socketId: client.id });
    // let socketId = (await User.findOne({ _id: body.userId }).select("socketId"))
    //   ?.socketId;
    if (sender) {
      let message = new Message({
        content: body.content,
        sender: sender._id,
        conversation: body.conversation,
      });
      await message.save();

      let _message = await Message.findOne({ _id: message._id }).populate(
        "sender"
      );

      let eventName = `${ClientEvent.ReceiverMessage}-${body.conversation}`;
      this.server.to(body.conversation).emit(eventName, _message);
      // if (socketId) {
      //   this.server.to(socketId).emit(ClientEvent.ReceiverMessage, _message);
      // }

      cb(_message);
    }
  }

  @SubscribeMessage(ServerEvent.JoinRoom)
  async joinRoom(client: Socket, roomId: string, cb?: Function) {
    console.log("joinRoom", roomId);
    client.join(roomId);
    cb?.();
  }

  @SubscribeMessage(ServerEvent.LeaveRoom)
  async leaveRoom(client: Socket, roomId: string, cb?: Function) {
    console.log("leaveRoom", roomId);
    client.leave(roomId);
    cb?.();
  }

  @SubscribeMessage(ServerEvent.SendToUser)
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

  @SubscribeMessage(ServerEvent.Login)
  async login(client: Socket, userId: string, cb: Function) {
    console.log("login", userId);

    let user = await User.findOne({ _id: userId });
    if (user) {
      user.online = true;
      user.socketId = client.id;
      await user.save();

      this.server.emit(ClientEvent.UpdateUser, user);
    }

    cb();
  }

  @SubscribeMessage(ServerEvent.Online)
  async changeStatus(client: Socket) {}

  @SubscribeMessage("connection")
  connection() {
    console.log("User connected");
  }

  @SubscribeMessage("disconnect")
  async disconnect(client: Socket) {
    // console.log("disconnect", client.id);
    // await User.updateOne(
    //   { socketId: client.id },
    //   { $set: { socketId: null, online: false } }
    // );

    let user = await User.findOne({ socketId: client.id });
    if (user) {
      user.online = false;
      user.socketId = undefined;
      await user.save();

      this.server.emit(ClientEvent.UpdateUser, user);
    }
  }
}
