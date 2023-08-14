import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { BaseMiddleware } from "../core";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from ".";
import { JWTPayload } from "../services/auth.service";

export class JwtMiddleware extends BaseMiddleware {
  use(
    req: any,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): void {
    let { authorization } = req.headers;
    if (!authorization) {
      return next("Api yêu cầu quyền truy cập");
    }

    let check = jsonwebtoken.verify(
      authorization.replace("Bearer ", ""),
      JWT.SECRET_KEY
    ) as JWTPayload;
    if (check) {
      req.user = check.id;
      return next();
    }

    next("Token invalid");
  }
}
