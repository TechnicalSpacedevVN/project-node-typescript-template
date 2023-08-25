import { Field, GraphQL, Param, Resolve } from "@/common/core/decorator";
import { Post } from "./post.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { PostService } from "./post.service";
import { Document, Model } from "mongoose";
import { User } from "@/user/user.model";

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
  async posts(_: any, args: { q?: string; user?: string }) {
    if (args.user) {
      return await Post.find({ author: args.user }).sort({ _id: -1 }).limit(10);
    }

    return await Post.find().sort({ _id: -1 }).limit(10);
    // return await this.postService.searchPost(content);
  }

  @Resolve("post: Post")
  async post(@Param("content") content: string) {
    return await this.postService.searchOnePost(content);
  }
}
