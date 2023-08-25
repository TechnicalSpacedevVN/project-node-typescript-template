import Joi from "joi";

export const validateCreatePostSchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string().uri(),
});
