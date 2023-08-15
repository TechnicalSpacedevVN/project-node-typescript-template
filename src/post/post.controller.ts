import { Controller, Delete, Patch, Post, Validate } from "@core/decorator";
import { Inject } from "@core/decorator/DI-IoC";
import { UseGuard } from "@core/decorator/guard";
import { PostService } from "./post.service";
import { validateCreatePostSchema } from "./post.validate-schema";

@Controller("/post")
@UseGuard()
export class PostController {
  @Inject(PostService) private readonly postService!: PostService;

  @Post()
  @Validate(validateCreatePostSchema)
  createPost() {}

  @Patch("/:id")
  updatePost() {}

  @Delete("/:id")
  deletePost() {}

  @Post("/report/:id")
  reportPost() {}

  @Delete("/hidden/:id")
  hidePost() {}
}
