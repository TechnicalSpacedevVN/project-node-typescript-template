import { CustomValidator } from "joi";
import { isValidObjectId } from "mongoose";

export const validateObjectId: CustomValidator = (value, helper) => {
  if (!isValidObjectId(value)) {
    return helper.message("Vui lòng sử dụng ObjectId" as any);
  }
};
