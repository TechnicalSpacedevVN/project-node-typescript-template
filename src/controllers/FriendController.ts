import { Request } from "express";
import { Controller, Get, Validate } from "../core/decorator/router";
import { HttpResponse } from "../utils/HttpResponse";
import { FriendService } from "../services/friend.services";
import Joi from "joi";

let searchValidate = Joi.object({
  search: Joi.string().required(),
});

@Controller("/friend")
export class FriendController {
  @Get("/search")
  @Validate(searchValidate)
  async searchFriend(req: Request<any, any, any, { search: string }>) {
    let { search } = req.query;
    let user = await FriendService.searchFriend(search);
    return HttpResponse.success(user);
  }
}
