import { BaseMiddleware } from "../BaseMiddleware";
import { GUARD_KEY } from "./key";

export const UseGuard =
  (middleware?: typeof BaseMiddleware): any =>
  (target: any) => {
    Reflect.defineMetadata(
      GUARD_KEY,
      middleware || true,
      target
    );
  };
