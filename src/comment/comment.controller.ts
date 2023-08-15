import { Controller, Delete, Patch, Post } from "@/common/core/decorator";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { CommentService } from "./comment.service";

@Controller("/comment")
export class CommentController {
  @Inject(CommentService) private readonly commentService!: CommentService;

  @Post("/:id")
  createComment() {}

  @Patch("/:id")
  editComment() {}

  @Delete("/:id")
  deleteComment() {}

  @Post("/report/:id")
  reportComment() {}

  @Post("/hide/:id")
  hideComment() {}
}
