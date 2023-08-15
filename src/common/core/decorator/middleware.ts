import { RequestHandler } from "express";
import { MIDDLEWARE_KEY } from "./key";

export const Middlewares = (...handlers: RequestHandler[]): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    Reflect.defineMetadata(MIDDLEWARE_KEY, handlers, target.constructor, propertyKey);
  };
};
