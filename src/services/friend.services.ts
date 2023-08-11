import { User } from "../models/user.model";

export class FriendService {
  public static searchFriend(search: string) {
    return User.find({ $text: { $search: search } });
  }
}
