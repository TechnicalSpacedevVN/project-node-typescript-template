import { GraphQL, Resolve } from "@core/decorator";
import { Inject } from "@core/decorator/DI-IoC";
import { User } from "./user.model";
import { FriendService } from "@/friend/friend.service";

@GraphQL(User, {
  name: "String",
  id: "String",
  token: "Token",
})
export class UserSchema {
  @Inject(FriendService) private readonly _friendService!: FriendService;

  @Resolve("[User]")
  users() {}

  // @Resolve("[User]")
  // async friends(parent: any, args: any) {
  //   return await this._friendService.searchFriend("Vương");
  // }

  @Resolve("User")
  user() {}
}
