import { GraphQL, Param, Resolve } from "@/common/core/decorator";
import { Friend } from "./friend.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { FriendService } from "./friend.service";

@GraphQL(Friend)
export class FriendSchema {
  @Inject(FriendService) private friendService!: FriendService;

  @Resolve("[User]")
  async friends(@Param("search") search: string, @Param("demo") demo: string) {
    console.log(search, demo);
    return await this.friendService.searchFriend(search);
  }
}
