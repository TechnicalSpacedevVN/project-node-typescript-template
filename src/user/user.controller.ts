import { Request } from "express";
import { Controller, Get, Patch, Post, Validate } from "@core/decorator/router";
import { HttpResponse } from "@/common/utils/HttpResponse";

import {
  RegisterInput,
  UserService,
  VerifyRegisterInput,
} from "./user.service";
import {
  validatVerifyRegisterSchema,
  validateRegisterSchema,
  validateUpdateUserSchema,
} from "./user.validate-schema";
import { JwtMiddleware, jwtMiddleware } from "@/common/config/jwt.middlware";
import { Middlewares, UseGuard } from "@core/decorator";
import { Inject } from "@core/decorator/DI-IoC";

@Controller("/user")
@UseGuard()
export class UserController {
  @Inject(UserService) private readonly userService!: UserService;

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

  @Patch("/update-info")
  @Validate(validateUpdateUserSchema)
  @Middlewares(jwtMiddleware)
  postUpdateInfo() {
    return { user: true };
  }
}
