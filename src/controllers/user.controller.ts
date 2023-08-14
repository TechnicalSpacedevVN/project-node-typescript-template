import { Request } from "express";
import { Controller, Get, Post } from "../core/decorator/router";
import { HttpResponse } from "../utils/HttpResponse";

import {
  RegisterInput,
  UserService,
  VerifyRegisterInput,
} from "../services/user.service";
import {
  validatVerifyRegisterSchema,
  validateRegisterSchema,
} from "../validate-schema/user";
import { Validate } from "../core/decorator";

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
}

