import { GraphQL, Resolve } from "@core/decorator";
import { Post } from "./post.model";

@GraphQL(Post)
export class PostSchema {
  @Resolve("[Post]")
  posts() {}
}
