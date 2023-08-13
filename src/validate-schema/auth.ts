import Joi from "joi";
import { validatePassowrd } from "../utils/validate";

export const validateLoginSchema = Joi.object({
  password: Joi.required().custom(validatePassowrd),
  email: Joi.string().required().email(),
});
