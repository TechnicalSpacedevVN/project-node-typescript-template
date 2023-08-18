import { Injectable } from "@core/decorator/DI-IoC";
import { User } from "@/user/user.model";



@Injectable()
export class FriendService {
  public searchFriend(search?: string) {
    if(search) {
      return User.find({ $text: { $search: search } });

    }
    return User.find();
  }
}
