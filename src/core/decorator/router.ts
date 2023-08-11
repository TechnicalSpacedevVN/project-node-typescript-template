import "reflect-metadata";
import { Express, NextFunction, Request, Response, Router } from "express";
import { Schema } from "joi";

const ROUTERS_KEY = "metadata:routers";

const VALIDATE_KEY = "metadata:routers:validate";

export const Controller = (prefix = '') => {
  return (target: any): any => {
    return class extends target {
      constructor(app: Express) {
        super();

        let router: any = Router();
        let routers = Reflect.getMetadata(ROUTERS_KEY, target);

        for (let i in routers) {
          let r = routers[i];
          let validate = Reflect.getMetadata(
            `${VALIDATE_KEY}:${r.propertyKey}`,
            target
          );

          let handlers = [
            async (req: Request, res: Response, next: NextFunction) => {
              try {
                let result = await r.handler(req, res, next);
                if(typeof result === 'object') {
                  res.json(result);
                }
              } catch (err) {
                next(err);
              }
            },
          ];
          if (validate) {
            handlers.unshift(validate);
          }

          router[r.method](r.url || '', ...handlers);
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
        handler: descriptor.value,
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
export const Delete = factoryMethod("Delete");
export const All = factoryMethod("all");

export const Validate = (schema: Schema) => {
  return (target: any, propertyKey: string, descriptor: any) => {
    Reflect.defineMetadata(
      `${VALIDATE_KEY}:${propertyKey}`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await schema.validateAsync({ ...req.body, ...req.query });
          next();
        } catch (err) {
          next(err);
        }
      },
      target.constructor
    );

    // let orignalMethod = descriptor.value;
    // descriptor.value = async function (
    //   req: Request,
    //   res: Response,
    //   next: NextFunction
    // ) {
    //   try {
    //     await schema.validateAsync({ ...req.body, ...req.query });
    //     return orignalMethod.apply(this, [req, res, next]);
    //   } catch (err) {
    //     next(err);
    //   }
    // };
  };
};
