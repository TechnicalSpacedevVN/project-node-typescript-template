import { Injectable } from "@/common/core/decorator/DI-IoC";
import { Post } from "./post.model";

@Injectable()
export class PostService {
  searchPost(content: string) {
    return Post.find({ $text: { $search: content } });
  }

  searchOnePost(content: string) {
    return Post.findOne({ $text: { $search: content } });
  }
}
