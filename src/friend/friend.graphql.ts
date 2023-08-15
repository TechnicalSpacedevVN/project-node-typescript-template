import { GraphQL, Resolve } from "@/common/core/decorator";
import { Friend } from "./friend.model";

@GraphQL(Friend)
export class FriendSchema {
  @Resolve("[User]")
  search() {}
}
