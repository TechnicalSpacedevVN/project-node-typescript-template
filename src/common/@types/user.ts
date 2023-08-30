import { Request as ExpressRequest } from "express";

export interface Request<
  ReqBody extends any = {},
  ReqQuery extends any = {},
  Param extends any = {}
> extends ExpressRequest<Param, any, ReqBody, ReqQuery> {}

export interface AuthRequest<
  ReqBody extends any = {},
  ReqQuery extends any = {},
  Param extends any = {}
> extends Request<ReqBody, ReqQuery, Param> {
  user: string;
}
