import Joi from "joi";

export const validateCreateHideContentSchema = Joi.object({
  type: Joi.valid("Post", "Comment"),
});
