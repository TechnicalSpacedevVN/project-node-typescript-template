import { RequestHandler } from "express";
import { MIDDLEWARE_KEY } from "./key";
import 'reflect-metadata'

export const Middlewares = (...hanlers: RequestHandler[]): any => {
  return (target: any, propertyKey: string, descriptor: any) => {
    Reflect.defineMetadata(
      MIDDLEWARE_KEY,
      hanlers,
      target,
      propertyKey
    );
  };
};
