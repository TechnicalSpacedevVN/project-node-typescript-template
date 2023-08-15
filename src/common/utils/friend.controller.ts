import { Request } from "express";
import Joi from "joi";
import { Validate } from "../core/decorator";
import { Inject } from "../core/decorator/DI-IoC";
import { UseGuard } from "../core/decorator/guard";
import { Controller, Get } from "../core/decorator/router";
import { FriendService } from "../../friend/friend.service";
import { HttpResponse } from "./HttpResponse";

let searchValidate = Joi.object({
  search: Joi.string().required(),
});

@Controller("/friend")
@UseGuard()
export class FriendController {
  @Inject(FriendService) private friendService!: FriendService;

  @Get("/search")
  @Validate(searchValidate)
  async searchFriend(req: Request<any, any, any, { search: string }>) {
    let { search } = req.query;
    let user = await this.friendService.searchFriend(search);
    return HttpResponse.success(user);
  }
}
