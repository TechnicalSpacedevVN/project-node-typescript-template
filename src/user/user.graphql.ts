import { Auth, Field, GraphQL, Resolve } from "@/common/core/decorator";
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
  allowFollow: Boolean
  block: [User]
  follow: [User]
  online: Boolean
`
)
export class UserSchema {
  @Field("block")
  async block(parent: any) {
    return await User.find({ _id: { $in: parent.block || [] } });
  }
  @Field("follow")
  async follow(parent: any) {
    return await User.find({ _id: { $in: parent.follow || [] } });
  }

  @Resolve("users(q: String!): [User]")
  @Auth
  async users(parent: any, args: any, context: AuthContext, info: any) {
    let blockUser =
      (await User.findOne({ _id: context.user }).select("block"))?.block || [];
    return await User.find({
      $text: { $search: args.q },
      _id: {
        $nin: blockUser,
      },
    });
  }

  @Resolve("user(_id: String!): User")
  @Auth
  async user(_: any, args: { _id: string }, context: AuthContext) {
    let blockUser =
      (await User.findOne({ _id: context.user }).select("block"))?.block || [];
    let user = await User.findOne({
      $and: [
        { _id: args._id },
        {
          _id: {
            $nin: blockUser,
          },
        },
      ],
    });
    return user;
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

    let blockUser = user?.block || [];
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
          $and: [
            {
              _id: {
                $nin: [...userIds, new mongoose.mongo.ObjectId(context.user)],
              },
            },
            {
              _id: {
                $nin: blockUser,
              },
            },
          ],
        },
      },
    ]).limit(6);
  }

  // @Resolve("blockUser: [User]")
  // @Auth
  // async blockUser(_: any,__: any, context: AuthContext) {
  //   // let user = await User.findOne({_id: context.user})
  //   // return await Us
  // }
}
