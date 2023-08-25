import {
  Auth,
  Field,
  GraphQL,
  Middlewares,
  Param,
  Parent,
  Resolve,
} from "@/common/core/decorator";
import { Friend } from "./friend.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { FriendService } from "./friend.service";
import { User } from "@/user/user.model";
import { AuthContext } from "@/common/@types/type";

@GraphQL(
  `Friend`,
  `
  _id: String!
  sender: User
  receiver: User
  confirm: Boolean
`
)
export class FriendSchema {
  @Inject(FriendService) private friendService!: FriendService;

  @Field("sender")
  async sender(parent: any, args: any, context: any, info: any) {
    return await User.findOne({ _id: parent.sender });
  }

  @Field("receiver")
  async receiver(parent: any, args: any, context: any, info: any) {
    return await User.findOne({ _id: parent.receiver });
  }

  @Resolve("friends(user: String): [Friend]")
  @Auth
  async friends(parent: any, args: { user?: string }, context: any, info: any) {
    if (args.user) {
      return await Friend.find({
        confirm: true,
        $or: [{ sender: args.user }, { receiver: args.user }],
      });
    }

    return await Friend.find({
      $or: [{ sender: context.user }, { receiver: context.user }],
    });
    // return await this.friendService.searchFriend(context.user, args.search);
  }

  @Resolve("myFriends: [Friend]")
  @Auth
  async myFriends(parent: any, args: any, context: any, info: any) {
    return await Friend.find({
      confirm: true,
      $or: [{ receiver: context.user }, { sender: context.user }],
    });
  }

  @Resolve("checkFriend(user: String!): Friend")
  @Auth
  async checkFriend(_: any, args: { user: string }, context: AuthContext) {
    return await Friend.findOne({
      $or: [
        { sender: args.user, receiver: context.user },
        { receiver: args.user, sender: context.user },
      ],
    });
  }
}
