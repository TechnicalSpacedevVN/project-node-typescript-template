import { Request } from "express";
import { Controller, Post, Validate } from "../core/decorator/router";
import {
  validateLoginSchema,
  validateRefreshTokenSchema,
} from "../validate-schema/auth";
import { AuthService, LoginInput } from "../services/auth.service";
import { HttpResponse } from "../utils/HttpResponse";
import { Inject } from "../core/decorator/DI-IoC";

@Controller("/auth")
export class AuthController {
  @Inject(AuthService)
  private authService!: AuthService;

  @Post("/login")
  @Validate(validateLoginSchema)
  async postLogin(req: Request<any, any, LoginInput>) {
    return HttpResponse.success(await this.authService.login(req.body));
  }

  @Post("/refresh-token")
  @Validate(validateRefreshTokenSchema)
  async postRefreshToken(req: Request<any, any, { refreshToken: string }>) {
    return HttpResponse.success(
      await this.authService.refreshToken(req.body.refreshToken)
    );
  }
}
