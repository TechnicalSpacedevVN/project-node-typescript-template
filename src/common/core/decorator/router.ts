import { Express, NextFunction, Request, Response, Router } from "express";
import "reflect-metadata";
import { APP_TOKEN, GUARD_KEY, MIDDLEWARE_KEY, ROUTERS_KEY, VALIDATE_KEY } from "./key";
import { BaseMiddleware } from "../BaseMiddleware";
import { container } from "./DI-IoC";
import { AppData } from ".";
export interface ControllerOptions {
  guard?: { new (): BaseMiddleware } & typeof BaseMiddleware;
}

export const Controller = (prefix = "") => {
  return (target: any): any => {
    return class extends target {
      constructor() {
        super();

        let { app, guard } = container.resolve(APP_TOKEN) as AppData;

        let router: any = Router();
        let routers = Reflect.getMetadata(ROUTERS_KEY, target);

        for (let i in routers) {
          let r = routers[i];

          let handlers = [
            async (req: Request, res: Response, next: NextFunction) => {
              try {
                let result = await this[r.propertyKey](req, res, next);
                if (typeof result === "object") {
                  res.json(result);
                }
              } catch (err) {
                next(err);
              }
            },
          ];
          let validate = Reflect.getMetadata(
            `${VALIDATE_KEY}:${r.propertyKey}`,
            target
          );
          if (validate) {
            handlers.unshift(validate);
          }

          let middlewares = Reflect.getMetadata(MIDDLEWARE_KEY, target, r.propertyKey);
          if(Array.isArray(middlewares)) {
            handlers.unshift(...middlewares)
          }


          let guardRouter = Reflect.getMetadata(GUARD_KEY, target);
          if (guardRouter && guard?.use) {
            handlers.unshift(guard.use as any);
          }
          router[r.method](r.url || "", ...handlers);
        }
        app.use(prefix, router);
      }
    };
  };
};

const factoryMethod = (method: string) => {
  return (url?: string) => {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ): any => {
      let routers = Reflect.getMetadata(ROUTERS_KEY, target.constructor) || [];

      routers.push({
        method,
        propertyKey,
        url,
      });

      Reflect.defineMetadata(ROUTERS_KEY, routers, target.constructor);
    };
  };
};

export const Get = factoryMethod("get");
export const Post = factoryMethod("post");
export const Put = factoryMethod("put");
export const Patch = factoryMethod("patch");
export const Delete = factoryMethod("delete");
export const All = factoryMethod("all");
