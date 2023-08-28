export interface CreateCommentInput {
  createdBy: string;
  refId: string;
  content?: string;
  image?: string;
  replyId?: string;
}

export type EditCommentInput = Pick<CreateCommentInput, "content">;

export interface BodyCreateComment
  extends Omit<CreateCommentInput, "createdBy"> {}
