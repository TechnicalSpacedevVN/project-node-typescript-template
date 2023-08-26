import "reflect-metadata";
import { Express, NextFunction, Request, Response, Router } from "express";
import { Schema } from "joi";
import { BaseMiddleware } from "..";
import { GUARD_KEY, MIDDLEWARE_KEY, ROUTERS_KEY, VALIDATE_KEY } from "./key";

export interface ControllerOptions {
  guard?: new () => BaseMiddleware;
}

export const Controller = (prefix = "") => {
  return (target: any): any => {
    return class extends target {
      constructor(app: Express, options: ControllerOptions) {
        super();

        let _guard;

        if (options.guard && options.guard) {
          let guard = new options.guard();
          _guard = guard.use;
        }

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
                let result = await r.handler.apply(this, [req, res, next]);
                if (typeof result === "object") {
                  res.status(result.code || 200).json(result);
                }
              } catch (err) {
                next(err);
              }
            },
          ];
          if (validate) {
            handlers.unshift(validate);
          }

          let middlewares = Reflect.getMetadata(
            MIDDLEWARE_KEY,
            this,
            r.propertyKey
          );
          if (Array.isArray(middlewares)) {
            handlers.unshift(...middlewares);
          }

          let guard = Reflect.getMetadata(GUARD_KEY, target);
          if (guard && _guard) {
            handlers.unshift(_guard as any);
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
export const Delete = factoryMethod("delete");
export const All = factoryMethod("all");

export const Validate = (schema: Schema) => {
  return (target: any, propertyKey: string, descriptor: any) => {
    Reflect.defineMetadata(
      `${VALIDATE_KEY}:${propertyKey}`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await schema.validateAsync(
            { ...req.body, ...req.query },
            {
              abortEarly: false,
              messages: {
                "any.required": "{{#label}} là bắt buộc",
                "string.alphanum":
                  "{{#label}} must only contain alpha-numeric characters",
                "string.base": "{{#label}} must be a string",
                "string.base64": "{{#label}} must be a valid base64 string",
                "string.creditCard": "{{#label}} must be a credit card",
                "string.dataUri": "{{#label}} must be a valid dataUri string",
                "string.domain": "{{#label}} must contain a valid domain name",
                "string.email": "{{#label}} phải là một email",
                "string.empty": "{{#label}} is not allowed to be empty",
                "string.guid": "{{#label}} must be a valid GUID",
                "string.hex":
                  "{{#label}} must only contain hexadecimal characters",
                "string.hexAlign":
                  "{{#label}} hex decoded representation must be byte aligned",
                "string.hostname": "{{#label}} must be a valid hostname",
                "string.ip":
                  "{{#label}} must be a valid ip address with a {{#cidr}} CIDR",
                "string.ipVersion":
                  "{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR",
                "string.isoDate": "{{#label}} must be in iso format",
                "string.isoDuration":
                  "{{#label}} must be a valid ISO 8601 duration",
                "string.length":
                  "{{#label}} length must be {{#limit}} characters long",
                "string.lowercase":
                  "{{#label}} must only contain lowercase characters",
                "string.max":
                  "{{#label}} length must be less than or equal to {{#limit}} characters long",
                "string.min":
                  "{{#label}} length must be at least {{#limit}} characters long",
                "string.normalize":
                  "{{#label}} must be unicode normalized in the {{#form}} form",
                "string.token":
                  "{{#label}} must only contain alpha-numeric and underscore characters",
                "string.pattern.base":
                  "{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}",
                "string.pattern.name":
                  "{{#label}} with value {:[.]} fails to match the {{#name}} pattern",
                "string.pattern.invert.base":
                  "{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}",
                "string.pattern.invert.name":
                  "{{#label}} with value {:[.]} matches the inverted {{#name}} pattern",
                "string.trim":
                  "{{#label}} must not have leading or trailing whitespace",
                "string.uri": "{{#label}} must be a valid uri",
                "string.uriCustomScheme":
                  "{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern",
                "string.uriRelativeOnly":
                  "{{#label}} must be a valid relative uri",
                "string.uppercase":
                  "{{#label}} must only contain uppercase characters",
              },
            }
          );
          next();
        } catch (err: any) {
          next(
            err.details.reduce(
              (result: any, current: any) => ({
                ...result,
                [current.context.key]: current.message.replaceAll('"', ""),
              }),
              {}
            )
          );
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
