import Joi from "joi";

export const validateCreatePostSchema = Joi.object({
  content: Joi.optional(),
  image: Joi.string().required().uri(),
});

export const validateUpdatePostSchema = Joi.object({
  content: Joi.optional(),
  image: Joi.string().uri(),
});
