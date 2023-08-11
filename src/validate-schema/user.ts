import Joi from "joi";
import { validatePassowrd } from "../utils/validate";

export const validateRegisterSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.required().custom(validatePassowrd),
  email: Joi.string().required().email(),
});

export const validatVerifyRegisterSchema = Joi.object({
  code: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const validatResetPasswordByCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
  newPassword: Joi.required().custom(validatePassowrd),
});
