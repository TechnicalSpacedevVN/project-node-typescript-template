import { Request } from "express";
import { Controller, Post } from "../core/decorator/router";
import { validateLoginSchema } from "../validate-schema/auth";
import { AuthService, LoginInput } from "../services/auth.service";
import { HttpResponse } from "../utils/HttpResponse";
import { Validate } from "../core/decorator";

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
