import { GraphQL, Resolve } from "@/common/core/decorator";
import { User } from "./user.model";

@GraphQL(User)
export class UserSchema {
  @Resolve("user: User")
  user() {}

  @Resolve("userFriends: [User]")
  userFriends(parent: any, arg: any, context: any, info: any) {
    console.log(info);
    return [];
  }
}
