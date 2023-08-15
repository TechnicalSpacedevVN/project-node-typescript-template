import { Request } from "express";
import { Controller, Post } from "../common/core/decorator/router";
import { validateLoginSchema } from "./auth.validate-schema";
import { AuthService, LoginInput } from "./auth.service";
import { HttpResponse } from "../common/utils/HttpResponse";
import { Validate } from "../common/core/decorator";
import { Injectable } from "../common/core/decorator/DI-IoC";

@Controller("/auth")
export class AuthController {
  @Post("/login")
  @Validate(validateLoginSchema)
  async postLogin(req: Request<any, any, LoginInput>) {
    let data = await AuthService.login(req.body);

    return HttpResponse.success(data);
  }

  @Post("/refresh-token")
  async postRefreshToken(req: Request<any, any, { refreshToken: string }>) {
    let data = await AuthService.refreshToken(req.body.refreshToken);

    return HttpResponse.success(data);
  }
}
