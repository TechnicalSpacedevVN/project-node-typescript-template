import { Injectable } from "@/common/core/decorator/DI-IoC";
import { CreateCommentInput, EditCommentInput } from "./comment.type";
import { Comment } from "./comment.model";

@Injectable()
export class CommentService {
  async createComment(input: CreateCommentInput) {
    let comment = new Comment(input);
    await comment.save();
    return comment;
  }

  async editComment(id: string, createdBy: string, input: EditCommentInput) {
    return await Comment.updateOne({ _id: id, createdBy }, { $set: input });
  }

  async deleteComment(id: string, createdBy: string) {
    let result = await Comment.deleteOne({ _id: id, createdBy });

    if (result.deletedCount === 1) {
      return true;
    }
    throw "Bạn không có quyền thực hiện hành động này";
  }
}
