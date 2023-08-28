import Joi from "joi";

export const validateCreateReportSchema = Joi.object({
  content: Joi.string(),
  type: Joi.valid("Post", "User", "Comment"),
});
