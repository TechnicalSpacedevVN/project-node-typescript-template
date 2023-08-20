import { GraphQL, Param, Resolve } from "@/common/core/decorator";
import { Post } from "./post.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { PostService } from "./post.service";

@GraphQL('Post', `
  content: String
`)
export class PostSchema {
  @Inject(PostService) postService!: PostService;

  @Resolve("posts: [Post]")
  async posts(@Param("content") content: string) {
    return await this.postService.searchPost(content);
  }

  @Resolve("post: Post")
  async post(@Param("content") content: string) {
    return await this.postService.searchOnePost(content);
  }
}
