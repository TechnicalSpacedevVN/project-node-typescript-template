import { Request } from "express";
import { Controller, Get, Validate } from "@core/decorator/router";
import { HttpResponse } from "../common/utils/HttpResponse";
import { FriendService } from "./friend.service";
import Joi from "joi";
import { UseGuard } from "@core/decorator";
import { Inject } from "@core/decorator/DI-IoC";
import { AuthService } from "@/auth/auth.service";

let searchValidate = Joi.object({
  search: Joi.string().required(),
});

@Controller("/friend")
@UseGuard()
export class FriendController {
  @Inject(FriendService) private readonly friendService!: FriendService;
  @Inject(AuthService) private authService!: AuthService;

  @Get("/search")
  @Validate(searchValidate)
  async searchFriend(req: Request<any, any, any, { search: string }>) {
    let { search } = req.query;
    let user = await this.friendService.searchFriend(search);
    return HttpResponse.success(user);
  }
}


// Singleton