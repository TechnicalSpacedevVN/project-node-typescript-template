import { Request } from "express";
import { Controller, Get } from "../core/decorator/router";
import { HttpResponse } from "../utils/HttpResponse";
import { FriendService } from "../services/friend.services";
import Joi from "joi";
import { Validate } from "../core/decorator";
import { UseGuard } from "../core/decorator/guard";
import { JWTMiddlware } from "../config/jwt.middleware";

let searchValidate = Joi.object({
  search: Joi.string().required(),
});

@Controller("/friend")
@UseGuard()
export class FriendController {
  @Get("/search")
  @Validate(searchValidate)
  async searchFriend(req: Request<any, any, any, { search: string }>) {
    let { search } = req.query;
    let user = await FriendService.searchFriend(search);
    return HttpResponse.success(user);
  }
}
