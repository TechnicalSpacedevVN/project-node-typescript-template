import { Request } from "express";
import { Controller, Get } from "../core/decorator/router";
import { HttpResponse } from "../utils/HttpResponse";

@Controller('/user')
export class UserController {
    @Get('/search')
    searchFriend(req: Request) {
        return HttpResponse.success([])
    }
}