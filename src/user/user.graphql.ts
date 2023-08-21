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
`
)
export class UserSchema {
  @Resolve("user(q: String!): User")
  @Auth
  async user(parent: any, args: any, context: any, info: any) {
    return await User.findOne({ _id: context.user });
  }

  @Resolve("userFriends: [User]")
  userFriends() {}

  @Resolve("profile: User")
  @Auth
  async profile(parent: any, args: any, context: any, info: any) {
    return await User.findOne({ _id: context.user });
  }
}
