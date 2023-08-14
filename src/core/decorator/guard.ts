import { BaseMiddleware } from "..";
import { GUARD_KEY } from "./key";

export const UseGuard = () => {
  return (target: any) => {
    Reflect.defineMetadata(GUARD_KEY, true, target);
  };
};

export const Middlewares = (middlewares: (new () => BaseMiddleware)[]): any => {
  return (target: any) => {};
};
