import { BaseMiddleware } from "../core/BaseMiddleware";
import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from ".";
export interface AuthRequest extends Request {
  user: string;
}

export class JWTMiddlware extends BaseMiddleware {
  use(req: AuthRequest, res: Response, next: NextFunction) {
    let { authorization } = req.headers;
    if (!authorization) {
      return next("Api yêu cầu quyền truy cập");
    }

    let check: any = jsonwebtoken.verify(
      authorization.replace("Bearer ", ""),
      JWT.SECRET_KEY
    );
    if (check) {
      req.user = check.id;
      return next();
    }

    next("Token invalid");
  }
}
