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

@GraphQL(
  `Friend`,
  `
  _id: String!
  sender: User
  receiver: User
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

  @Resolve("friends: [Friend]")
  @Auth
  async friends(parent: any, args: any, context: any, info: any) {
    return await Friend.find({
      $or: [{ sender: context.user }, { receiver: context.user }],
    });
    // return await this.friendService.searchFriend(context.user, args.search);
  }

  @Resolve("myFriends: [Friend]")
  async myFriends(parent: any, args: any, context: any, info: any) {
    console.log(context);
    // return await this.friendService.searchFriend();
  }
}
