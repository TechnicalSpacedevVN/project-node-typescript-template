import { Inject, Injectable } from "../core/decorator/DI-IoC";
import { User } from "../models/user.model";

@Injectable()
export class FriendService {
  public searchFriend(search: string) {
    return User.find({ $text: { $search: search } });
  }
}
