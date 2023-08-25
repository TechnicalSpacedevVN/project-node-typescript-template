import { Controller, Post, UseGuard, Validate } from "@/common/core/decorator";
import { Post as PostModel } from "./post.model";
import { validateCreatePostSchema } from "./post.validate-schema";
import { AuthRequest } from "@/common/@type";
import { CreatePostInput } from "./post.type";
import { HttpResponse } from "@/common/utils/HttpResponse";

@Controller("/post")
@UseGuard()
export class PostController {
  @Post()
  @Validate(validateCreatePostSchema)
  async createPost(req: AuthRequest<CreatePostInput>) {
    const { content, image } = req.body;
    const post = new PostModel({
      content,
      image,
      author: req.user,
    });

    await post.save();
    return HttpResponse.created(post);
  }
}
