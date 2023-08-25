import { Auth, Field, GraphQL, Param, Resolve } from "@/common/core/decorator";
import { Post } from "./post.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { PostService } from "./post.service";
import { Document, Model } from "mongoose";
import { User } from "@/user/user.model";
import { AuthContext } from "@/common/@types/type";

@GraphQL(
  `Post`,
  `
  _id: String!
  content: String!
  image: String!
  author: User
  createdAt: Date
  updatedAt: Date
`
)
export class PostSchema {
  @Inject(PostService) postService!: PostService;

  @Field("author")
  async author(parent: any) {
    return User.findOne({ _id: parent.author });
  }

  @Resolve("posts(q: String, user: String): [Post]")
  @Auth
  async posts(
    _: any,
    args: { q?: string; user?: string },
    context: AuthContext
  ) {
    if (args.user) {
      return await Post.find({ author: args.user }).sort({ _id: -1 }).limit(10);
    }

    let user = await User.findOne({ _id: context.user }).select("block follow");
    const blockUser = user?.block || [];

    const follow = user?.follow || [];

    // return await Post.find({
    //   author: {
    //     $nin: blockUser,
    //   },
    // })
    //   .sort({ _id: -1 })
    //   .limit(10);
    try {
      let res = await Post.aggregate([
        {
          $addFields: {
            isFollow: {
              $in: ["$author", follow],
            },
          },
        },
        {
          $match: {
            author: {
              $nin: blockUser,
            },
          },
        },
        {
          $sort: {
            isFollow: -1,
            createdAt: -1,
          },
        },
      ]).limit(10);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  @Resolve("post: Post")
  async post(@Param("content") content: string) {
    return await this.postService.searchOnePost(content);
  }
}
