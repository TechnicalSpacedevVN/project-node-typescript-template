import {
  Controller,
  Delete,
  Patch,
  Post,
  UseGuard,
  Validate,
} from "@/common/core/decorator";
import { Inject } from "@/common/core/decorator/DI-IoC";
import { CommentService } from "./comment.service";
import { validateCreateCommentSchema } from "./comment.validate-schema";
import { BodyCreateComment, EditCommentInput } from "./comment.type";
import { AuthRequest } from "@/common/@type";
import { HttpResponse } from "@/common/utils/HttpResponse";
import { Comment } from "./comment.model";

@Controller("/comment")
@UseGuard()
export class CommentController {
  @Inject(CommentService) commentService!: CommentService;

  @Post()
  @Validate(validateCreateCommentSchema)
  async createComment(req: AuthRequest<BodyCreateComment>) {
    return HttpResponse.created(
      await this.commentService.createComment({
        createdBy: req.user,
        ...req.body,
      })
    );
  }

  @Patch("/:id")
  @Validate(validateCreateCommentSchema)
  async editComment(req: AuthRequest<EditCommentInput, any, { id: string }>) {
    return HttpResponse.updated(
      await this.commentService.editComment(req.params.id, req.user, req.body)
    );
  }

  @Delete("/:id")
  async deleteComment(req: AuthRequest<any, any, { id: string }>) {
    return HttpResponse.deleted(
      await this.commentService.deleteComment(req.params.id, req.user)
    );
  }
}
