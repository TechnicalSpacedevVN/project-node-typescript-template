import { validateObjectId } from "@/common/utils/valdiate";
import Joi from "joi";

export const validateAddFriendSchema = Joi.object({
  receiverId: Joi.required().custom(validateObjectId),
});

export const validateSearchFriendSchema = Joi.object({
  q: Joi.string().required(),
});
