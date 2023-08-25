import { Injectable } from "@core/decorator/DI-IoC";
import { User } from "@/user/user.model";
import { AddFriendInput } from "./type";
import { Friend } from "./friend.model";

@Injectable()
export class FriendService {
  public async searchFriend(userId: string, search?: string) {
    if (search) {
      let friends = await Friend.find({
        $or: [
          {
            sender: userId,
          },
          {
            receiver: userId,
          },
        ],
      }).select("_id receiver sender");

      let userFriendIds = friends.map((e) => {
        if (e.sender?.toString() === userId) {
          return e.receiver;
        } else {
          return e.sender;
        }
      });

      return await User.find({
        $text: {
          $search: search,
        },
        _id: {
          $in: userFriendIds,
        },
      });

      // let users = await User.aggregate(
      //   [
      //     {
      //       $match: {
      //         $text: {
      //           $search: search,
      //         },
      //       },
      //     },
      //   ]
      //   // {
      //   //   // $text: {
      //   //   //   $search: search,
      //   //   // },
      //   //   _id: {
      //   //     $in: userIds,
      //   //   },
      //   // }
      // );

      // console.log(users);
      // return users;
      // return User.find({ $text: { $search: search } });

      // return Friend.find({
      //   $or: [
      //     {
      //       sender: userId,
      //     },
      //     {
      //       receiver: userId,
      //     },
      //   ],
      // })
      //   .populate({
      //     path: "sender",
      //     select: { _id: 1, name: 1, avatar: 1 },
      //   })
      //   .populate({
      //     path: "receiver",
      //     select: { _id: 1, name: 1, avatar: 1 },
      //   })
      //   .where();
    }
    return User.find();
  }

  public async addFriend({ receiverId, senderId }: AddFriendInput) {
    if (receiverId === senderId) {
      throw "Không được kết bạn với chính mình";
    }

    let check = await Friend.findOne({
      $or: [
        {
          sender: senderId,
          receiver: receiverId,
        },
        {
          receiver: senderId,
          sender: receiverId,
        },
      ],
    });

    if (check) {
      throw "Người này đã được kết bạn, vui lòng kiểm tra lại";
    }

    let friend = new Friend({
      receiver: receiverId,
      sender: senderId,
    });
    await friend.save();
    return true;
  }

  public async getFriend(userId: string) {
    let friends = await Friend.find({
      $or: [
        {
          sender: userId,
        },
        {
          receiver: userId,
        },
      ],
      confirm: true,
    })
      .populate({
        path: "sender",
        select: { _id: 1, name: 1, avatar: 1 },
      })
      .populate({
        path: "receiver",
        select: { _id: 1, name: 1, avatar: 1 },
      });

    return friends;
  }

  public async confirm(myUser: String, senderId: string) {
    let friend = await Friend.findOne({
      sender: senderId,
      receiver: myUser,
    });
    if (friend) {
      friend.confirm = true;
      await friend.save();
      return true;
    }
    throw "Người này chưa gửi kết bạn với bạn";
  }
}
