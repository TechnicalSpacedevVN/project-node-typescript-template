import { Inject, Injectable } from "../common/core/decorator/DI-IoC";
import { User } from "../user/user.model";

@Injectable()
export class FriendService {
  public searchFriend(search: string) {
    return User.find({ $text: { $search: search } });
  }
}
