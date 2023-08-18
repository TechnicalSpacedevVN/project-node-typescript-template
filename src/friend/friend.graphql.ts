import { GraphQL, Middlewares, Param, Parent, Resolve } from "@/common/core/decorator";
import { Friend } from "./friend.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { FriendService } from "./friend.service";

@GraphQL(Friend)
export class FriendSchema {
  @Inject(FriendService) private friendService!: FriendService;

  @Resolve("[User]")
  async friends(@Param("search") search: string) {
    return await this.friendService.searchFriend(search);
  }


  @Resolve("[Friend]")
  async myFriends(parent: any, args: any, context: any, info: any) {
    console.log(context)
    // return await this.friendService.searchFriend();
  }

}
