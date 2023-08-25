import { Auth, GraphQL, Resolve } from "@/common/core/decorator";
import { User } from "./user.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { UserService } from "./user.service";
import { AuthContext } from "@/common/@types/type";
import { Friend } from "@/friend/friend.model";
import mongoose, { Schema } from "mongoose";

@GraphQL(
  `User`,
  `
  _id: String!
  name: String!
  avatar: String
  email: String
  cover: String
  hideFriendList: Boolean
  nickname: String
  distance: Float
  location: Location
`
)
export class UserSchema {
  @Resolve("users(q: String!): [User]")
  @Auth
  async users(parent: any, args: any, context: any, info: any) {
    return await User.find({ $text: { $search: args.q } });
  }

  @Resolve("user(_id: String!): User")
  async user(_: any, args: { _id: string }) {
    return await User.findOne({ _id: args._id });
  }

  @Resolve("userFriends: [User]")
  userFriends() {}

  @Resolve("profile: User")
  @Auth
  async profile(parent: any, args: any, context: any, info: any) {
    return await User.findOne({ _id: context.user });
  }

  @Resolve("suggestionUser: [User]")
  @Auth
  async suggestionUser(parent: any, args: any, context: AuthContext) {
    let user = await User.findOne({ _id: context.user });
    let userIds = (
      await Friend.find({
        $or: [{ sender: context.user }, { receiver: context.user }],
      }).select("sender receiver")
    ).map((e) => {
      if (e.sender?.toString() === context.user.toString()) {
        return e.receiver;
      } else {
        return e.sender;
      }
    });
    return await User.aggregate([
      {
        $geoNear: {
          near: [
            user?.location?.coordinates[0] || 0,
            user?.location?.coordinates[1] || 0,
          ],
          distanceField: "distance",
        },
      },
      {
        $match: {
          _id: {
            $nin: [...userIds, new mongoose.mongo.ObjectId(context.user)],
          },
        },
      },
    ]).limit(6);
  }
}
