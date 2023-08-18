import { GraphQL, Resolve } from "@/common/core/decorator";
import { User } from "./user.model";

@GraphQL(User)
export class UserSchema {
  @Resolve("User")
  user() {}

  @Resolve("[User]")
  userFriends() {}
}
