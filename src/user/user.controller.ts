import { Request } from "express";
import { Controller, Get, Patch, Post } from "../common/core/decorator/router";
import { HttpResponse } from "../common/utils/HttpResponse";

import {
  RegisterInput,
  UserService,
  VerifyRegisterInput,
} from "./user.service";
import {
  validatVerifyRegisterSchema,
  validateRegisterSchema,
} from "./user.validate-schema";
import { Validate } from "../common/core/decorator";

@Controller("/user")
export class UserController {
  @Post("/register")
  @Validate(validateRegisterSchema)
  async register(req: Request<any, RegisterInput>) {
    let user = await UserService.register(req.body);
    return HttpResponse.success(user);
  }

  @Get("/verify-register")
  @Validate(validatVerifyRegisterSchema)
  async verifyRegister(req: Request<any, any, any, VerifyRegisterInput>) {
    await UserService.verifyRegister(req.query);
    return HttpResponse.success(true);
  }

  @Post("/reset-password")
  resetPassword() {}

  @Post("/change-password-by-code")
  changePasswordByCode() {}

  @Patch("/update")
  updateInfo() {}

  @Post("/change-password")
  changePassword() {}
}
