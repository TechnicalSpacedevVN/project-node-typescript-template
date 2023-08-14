import { Request } from "express";
import { Controller, Get } from "../core/decorator/router";
import { HttpResponse } from "../utils/HttpResponse";
import { FriendService } from "../services/friend.service";
import Joi from "joi";
import { Validate } from "../core/decorator";
import { UseGuard } from "../core/decorator/guard";
import { JWTMiddlware } from "../config/jwt.middleware";
import { TYPES } from "../config/type";
import { Inject } from "../core/decorator/DI-IoC";

let searchValidate = Joi.object({
  search: Joi.string().required(),
});

@Controller("/friend")
@UseGuard()
export class FriendController {
  constructor(@Inject(FriendService) private friendService: FriendService) {}

  @Get("/search")
  @Validate(searchValidate)
  async searchFriend(req: Request<any, any, any, { search: string }>) {
    let { search } = req.query;
    let user = await this.friendService.searchFriend(search);
    return HttpResponse.success(user);
  }
}
