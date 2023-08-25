import { Auth, GraphQL, Resolve } from "@/common/core/decorator";
import { User } from "./user.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { UserService } from "./user.service";

@GraphQL(
  `User`,
  `
  _id: String!
  name: String!
  avatar: String
  email: String
  cover: String
  hideFriendList: Boolean
  nickname: String
`
)
export class UserSchema {
  @Resolve("users(q: String!): [User]")
  @Auth
  async users(parent: any, args: any, context: any, info: any) {
    return await User.find({ $text: { $search: args.q } });
  }

  @Resolve("user(_id: String!): User")
  async user(_: any, args: { _id: string }) {
    return await User.findOne({ _id: args._id });
  }

  @Resolve("userFriends: [User]")
  userFriends() {}

  @Resolve("profile: User")
  @Auth
  async profile(parent: any, args: any, context: any, info: any) {
    return await User.findOne({ _id: context.user });
  }
}
