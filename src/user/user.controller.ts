import { Controller, Get, Patch, Post, Validate } from "@core/decorator/router";
import { HttpResponse } from "@/common/utils/HttpResponse";

import { UserService } from "./user.service";
import {
  validatVerifyRegisterSchema,
  validateChangePasswordSchema,
  validateForgotPasswordSchema,
  validateRegisterSchema,
  validateResetPasswordByCodeSchema,
  validateSearchUser,
  validateUpdateUserSchema,
} from "./user.validate-schema";
import { JwtMiddleware, jwtMiddleware } from "@/common/config/jwt.middlware";
import { Middlewares, UseGuard } from "@core/decorator";
import { Inject } from "@core/decorator/DI-IoC";
import { AuthRequest, Request } from "@/common/@type/user";
import {
  ChangePasswordByCodeInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  RegisterInput,
  UpdateUserInfoInput,
  VerifyRegisterInput,
} from "./type";

@Controller("/user")
export class UserController {
  @Inject(UserService) private readonly userService!: UserService;

  @Post("/register")
  @Validate(validateRegisterSchema)
  async register(req: Request<RegisterInput>) {
    let user = await this.userService.register(req.body);
    return HttpResponse.success(user);
  }

  @Get("/verify-register")
  @Validate(validatVerifyRegisterSchema)
  async verifyRegister(req: Request<any, VerifyRegisterInput>) {
    await this.userService.verifyRegister(req.query);
    return HttpResponse.success(true);
  }

  @Patch("/update-info")
  @Validate(validateUpdateUserSchema)
  @Middlewares(jwtMiddleware)
  async postUpdateInfo(req: AuthRequest<UpdateUserInfoInput>) {
    let { user } = req;
    return HttpResponse.updated(
      await this.userService.updateInfo(user, req.body)
    );
  }

  @Post("/change-password")
  @Validate(validateChangePasswordSchema)
  @Middlewares(jwtMiddleware)
  async changePassword(req: AuthRequest<ChangePasswordInput>) {
    return HttpResponse.success(
      await this.userService.changePassword(req.user, req.body)
    );
  }

  @Post("/forgot-password")
  @Validate(validateForgotPasswordSchema)
  async forgotPasword(req: Request<ForgotPasswordInput>) {
    return HttpResponse.success(
      await this.userService.forgotPassword(req.body)
    );
  }

  @Post("/change-password-by-code")
  @Validate(validateResetPasswordByCodeSchema)
  async changePasswordByCode(req: Request<ChangePasswordByCodeInput>) {
    return HttpResponse.success(
      await this.userService.changePasswordByCode(req.body)
    );
  }

  @Get("/search")
  @Middlewares(jwtMiddleware)
  @Validate(validateSearchUser)
  searchUser(req: AuthRequest<any, { q: string }>) {
    return HttpResponse.success(
      this.userService.searchUser(req.user, req.query.q)
    );
  }
}
