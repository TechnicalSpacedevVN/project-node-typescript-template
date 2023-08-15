import { GraphQL, Param, Parent, Resolve } from "@/common/core/decorator";
import { Comment } from "./comment.model";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { CommentService } from "./comment.service";

@GraphQL(Comment)
export class CommentSchema {
  @Inject(CommentService) private readonly commentService!: CommentService;

  @Resolve("[Comment]")
  comments(
    @Parent parent: any,
  ) {}

  @Resolve("Int")
  count() {}
}
