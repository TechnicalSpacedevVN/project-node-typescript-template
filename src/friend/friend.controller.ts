import { Request } from "express";
import { Controller, Get, Post, Validate } from "@core/decorator/router";
import { HttpResponse } from "../common/utils/HttpResponse";
import { FriendService } from "./friend.service";
import Joi from "joi";
import { UseGuard } from "@core/decorator";
import { Inject } from "@core/decorator/DI-IoC";
import { AuthService } from "@/auth/auth.service";
import {
  validateAddFriendSchema,
  validateSearchFriendSchema,
} from "./friend.valdiate-schema";
import { AuthRequest } from "@/common/@types";
import { AddFriendInput } from "./type";
import { Friend } from "./friend.model";

@Controller("/friend")
@UseGuard()
export class FriendController {
  @Inject(FriendService) private readonly friendService!: FriendService;
  @Inject(AuthService) private authService!: AuthService;

  @Get("/search")
  @Validate(validateSearchFriendSchema)
  async searchFriend(req: AuthRequest<any, { q: string }>) {
    return HttpResponse.success(
      await this.friendService.searchFriend(req.user, req.query.q)
    );
  }

  // @Get("/search")
  // @Validate(searchValidate)
  // async searchFriend(req: Request<any, any, any, { search: string }>) {
  //   let { search } = req.query;
  //   let user = await this.friendService.searchFriend(search);
  //   return HttpResponse.success(user);
  // }

  @Post("/add-friend")
  @Validate(validateAddFriendSchema)
  async addFriend(req: AuthRequest<{ receiverId: string }>) {
    return HttpResponse.success(
      await this.friendService.addFriend({
        receiverId: req.body.receiverId,
        senderId: req.user,
      })
    );
  }

  @Post("/cancel-friend-request/:id")
  async cancelFriendRequest(req: AuthRequest<any, any, { id: string }>) {
    console.log({
      $or: [
        { sender: req.user, receiver: req.params.id },
        {
          sender: req.params.id,
          receiver: req.user,
        },
      ],
    });
    return HttpResponse.deleted(
      await Friend.deleteOne({
        $or: [
          { sender: req.user, receiver: req.params.id },
          {
            sender: req.params.id,
            receiver: req.user,
          },
        ],
      })
    );
  }

  @Get("/my-friend")
  async getMyFriend(req: AuthRequest) {
    return HttpResponse.success(await this.friendService.getFriend(req.user));
  }

  @Post("/confirm/:id")
  async confirm(req: AuthRequest<any, any, { id: string }>) {
    return HttpResponse.success(
      await this.friendService.confirm(req.user, req.params.id)
    );
  }
}

// Singleton
