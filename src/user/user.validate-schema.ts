import Joi from "joi";
import { validateNewPassword, validatePassowrd } from "./utils";

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

export const validateUpdateUserSchema = Joi.object({
  name: Joi.string(),
  birthday: Joi.date(),
  avatar: Joi.string().uri(),
});

export const validateChangePasswordSchema = Joi.object({
  oldPassword: Joi.required().custom(validatePassowrd),
  newPassword: Joi.required().custom(validateNewPassword),
});

// export const validateChangePasswordSchema = Joi.alternatives().try(
//   Joi.object({
//     oldPassword: Joi.required().custom(validatePassowrd)
//   }),
//   Joi.object({
//     newPassword: Joi.required().custom(validateNewPassword)
//   })
// )

export const validateForgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  redirect: Joi.string().required(),
});

export const validateResetPasswordByCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
  newPassword: Joi.required().custom(validatePassowrd),
});

export const validateConfirmRegisterByCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string(),
});
