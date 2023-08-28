import Joi from "joi";
import { CreateCommentInput } from "./comment.type";

export const validateCreateCommentSchema = Joi.object<CreateCommentInput>({
  content: Joi.string(),
  image: Joi.string(),
  refId: Joi.string(),
  replyId: Joi.string().optional(),
});

export const validateUpdateCommentSchema = Joi.object<CreateCommentInput>({
  content: Joi.string(),
  image: Joi.string(),
});
