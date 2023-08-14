import { Request } from "express";
import { Controller, Get, Post, Validate } from "../core/decorator/router";
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
import { JwtMiddleware } from "../config/jwt.middlware";
import { Middlewares } from "../core/decorator";
import { Inject } from "../core/decorator/DI-IoC";

@Controller("/user")
export class UserController {
  
  @Inject(UserService) private readonly userService!: UserService

  @Post("/register")
  @Validate(validateRegisterSchema)
  async register(req: Request<any, RegisterInput>) {
    let user = await this.userService.register(req.body);
    return HttpResponse.success(user);
  }

  @Get("/verify-register")
  @Validate(validatVerifyRegisterSchema)
  async verifyRegister(req: Request<any, any, any, VerifyRegisterInput>) {
    await this.userService.verifyRegister(req.query);
    return HttpResponse.success(true);
  }

  @Post("/update-info")
  @Middlewares([JwtMiddleware])
  postUpdateInfo() {}
}
