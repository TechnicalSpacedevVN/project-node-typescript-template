import {
  Auth,
  GraphQL,
  Middlewares,
  Param,
  Parent,
  Field,
  Resolve,
} from "@/common/core/decorator";
import { Friend } from "./friend.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { FriendService } from "./friend.service";
import { UserService } from "@/user/user.service";
import { User } from "@/user/user.model";

@GraphQL(
  "Friend",
  `
  sender: User
  receiver: User
  createdAt: Date
  updatedAt: Date
`
)
export class FriendSchema {
  @Inject(FriendService) private friendService!: FriendService;
  @Inject(UserService) userService!: UserService;

  @Field("sender")
  async getSender(parent: any) {
    return parent;
  }
  @Field("receiver")
  async getReceiver(parent: any, arg: any, context: any) {
    return await User.findOne({ _id: context.user });
  }

  @Resolve("friends(q: String): [Friend]")
  @Auth
  async friends(_: any, arg: any, context: any) {
    return await this.friendService.searchFriend(context.user, arg.q);
  }

  @Resolve("myFriends: [Friend]")
  async myFriends(parent: any, args: any, context: any, info: any) {
    console.log(context);
    // return await this.friendService.searchFriend();
  }
}
