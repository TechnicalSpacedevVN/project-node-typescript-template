import { Auth, GraphQL, Resolve } from "@/common/core/decorator";
import { User } from "./user.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { UserService } from "./user.service";

@GraphQL('User', `
  name: String
  _id: String
  avatar: String
`)
export class UserSchema {
  @Inject(UserService) userService!: UserService;

  @Resolve("users(q: String!): [User]")
  @Auth
  users(parent: any, args: any, context: any) {
    let { user } = context;
    return this.userService.searchUser(user, args.q);
  }

  @Resolve("userFriends: [User]")
  userFriends(parent: any, arg: any, context: any, info: any) {
    return [];
  }
}
