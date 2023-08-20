import { Model, Schema } from "mongoose";
import { container } from "./DI-IoC";
import {
  APP_KEY,
  GRAPHQL_AUTH_KEY,
  GRAPHQL_GUARD,
  GRAPHQL_PARAM_KEY,
  GRAPHQL_RELATION_KEY,
  GRAPHQL_RESOLVE_KEY,
} from "./key";
import { AppData } from ".";
import { ApolloServer } from "@apollo/server";
import { BaseContext } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { Request, Response } from "express";
import { ContextFunction } from "@apollo/server";
import { ExpressMiddlewareOptions } from "@apollo/server/express4";
import { ExpressContextFunctionArgument } from "@apollo/server/express4";

let map = new Map();

map.set(String, "String");
map.set(Schema.Types.String, "String");
map.set("ObjectId", "String");
map.set(Schema.Types.ObjectId, "String");

// map.set(Number, "Int");
// map.set(Schema.Types.Number, "Int");

map.set(Boolean, "Boolean");
map.set(Schema.Types.Boolean, "Boolean");

// map.set(Date, "Date");
// map.set(Schema.Types.Date, "Date");

export interface GraphQLServerOptions {
  defs: any[];
  scalars?: any[];
  url?: string;
  playground?: string;
  getContext?: ContextFunction<[ExpressContextFunctionArgument], any>;
  guard?: (context: any, next: () => void) => void;
}

export const GraphQLServer = (options: GraphQLServerOptions): any => {
  if (options.guard) {
    container.register(GRAPHQL_GUARD, options.guard);
  }
  return (target: any) => {
    return class extends target {
      server: ApolloServer<BaseContext>;
      constructor() {
        super();

        let relation: any = {}

        let _types = "#graphql";
        let _resolvers = {};
        
        let _queries = "";
        for (let schema of options.defs) {
          let s = new schema();
          _types += s.getType();
          _resolvers = {
            ..._resolvers,
            ...s.getResolver(),
          };
          _queries += s.getQuery();
          let name = s.getName()
          if(name) {
            relation[name] = s.getRelation()
          }
        }

        if(options.scalars) {
          for(let item of options.scalars) {
            _types += `\n scalar ${item.name}` as any
            (relation as any)[item.name] = item.type
          }
        }

        
        this.server = new ApolloServer({
          typeDefs: `
            ${_types}

            type Query {
              ${_queries}
            }
          `,
          resolvers: {
            ...relation,
            Query: _resolvers,
          },
        });
      }

      async start() {
        const { app }: AppData = container.resolve(APP_KEY);
        await this.server.start();
        app.use(
          options.url || "/graphql",
          expressMiddleware<any>(this.server, {
            context: options.getContext as any,
          })
        );

        if (options.playground) {
          app.get(options.playground, (req, res) => {
            res.send(`<!DOCTYPE html >
            <html lang="en" style="min-width: 100vw; min-height: 100vh; overflow: hidden;">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Graphql Devtool</title>
                <style>
                    iframe{
                        min-width: 100vw;
                        min-height: 100vh;
                    }
                </style>
            </head>
            <body style="margin: 0;">
                <div style="width: 100%; height: 100%;" id='embedded-sandbox'></div>
                <script src="https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js"></script> 
                <script>
                new window.EmbeddedSandbox({
                    target: '#embedded-sandbox',
                    initialEndpoint: 'http://localhost:8000/graphql?',
                });
                </script>
            </body>
            </html>`);
          });
        }
      }
    };
  };
};

export const GraphQL = (name?: string, type?: string): any => {
  return (target: any) => {
    return class extends target {
      getName() {
        return name
      }
      getType() {
        if(name && type) {
          return `
          type ${name} { ${type} }
        `;
        }
        // let tree = (model.schema as any).tree;

        // let fields = "";

        // for (let i in tree) {
        //   if (map.has(tree[i]?.type || tree[i])) {
        //     fields += `\n${i}: ${map.get(tree[i]?.type || tree[i])}`;
        //   }
        // }

        // return `
        //   type ${model.modelName} {
        //     ${fields}
        //   }
        // `;
      }

      getResolver() {
        let queries = Reflect.getMetadata(GRAPHQL_RESOLVE_KEY, this);
        let results: any = {};
        let guardFn = container.resolve(GRAPHQL_GUARD);
        for (let name in queries) {
          let auth = Reflect.getMetadata(GRAPHQL_AUTH_KEY, this, name);
          if (auth && guardFn) {
            results[name] = (
              parent: any,
              arg: any,
              context: any,
              ...args: any[]
            ) => {
              let check = false;
              guardFn(context, () => {
                check = true;
              });
              if (check) {
                return this[name].call(this, parent, arg, context, ...args);
              }

              throw "Bạn không có quyền truy cập api này";
            };
          } else {
            results[name] = this[name].bind(this);
          }
          // results[name] = (parent: any, args: any, context: any, info: any) => {
          //   let _p: any[] = [parent, args, context, info];
          //   let params: any[] = Reflect.getMetadata(
          //     GRAPHQL_PARAM_KEY,
          //     this,
          //     name
          //   );
          //   if (Array.isArray(params)) {
          //     for (let i = params.length; i >= 0; i--) {
          //       let item = params[i];
          //       if (item.type === ParamType.Parent) {
          //         _p.unshift(parent);
          //       } else {
          //         _p.unshift(args[item.name]);
          //       }
          //     }
          //   }

          //   return this[name].apply(this, _p);
          // };
        }

        return results;
      }

      getRelation() {
        let queries = Reflect.getMetadata(GRAPHQL_RELATION_KEY, this);
        let results: any = {};
        let guardFn = container.resolve(GRAPHQL_GUARD);
        for (let name in queries) {
          let auth = Reflect.getMetadata(GRAPHQL_AUTH_KEY, this, name);
          if (auth && guardFn) {
            results[queries[name]] = (
              parent: any,
              arg: any,
              context: any,
              ...args: any[]
            ) => {
              let check = false;
              guardFn(context, () => {
                check = true;
              });
              if (check) {
                return this[name].call(this, parent, arg, context, ...args);
              }

              throw "Bạn không có quyền truy cập api này";
            };
          } else {
            results[queries[name]] = this[name].bind(this);
          }
        }

        return results;
      }

      getQuery() {
        let queries = Reflect.getMetadata(GRAPHQL_RESOLVE_KEY, this);
        let str = "";
        for (let name in queries) {
          // let params: any[] = Reflect.getMetadata(
          //   GRAPHQL_PARAM_KEY,
          //   this,
          //   name
          // );
          // let _pStr = "";
          // if (params) {
          //   _pStr = `(${params
          //     .filter((e) => e.type === ParamType.Param)
          //     .map((e) => `${e.name}: String`)
          //     .join(",")})`;
          // }

          str += `\n${queries[name]}`;
        }
        return str;
      }
    };
  };
};

export const Resolve =
  (def: string) =>
  (target: any, propertyKey: string, descriptor: any): any => {
    let queries = Reflect.getMetadata(GRAPHQL_RESOLVE_KEY, target) || {};
    queries[propertyKey] = def;
    Reflect.defineMetadata(GRAPHQL_RESOLVE_KEY, queries, target);
  };

  export const Field =
  (def: string) =>
  (target: any, propertyKey: string, descriptor: any): any => {
    let queries = Reflect.getMetadata(GRAPHQL_RELATION_KEY, target) || {};
    queries[propertyKey] = def;
    Reflect.defineMetadata(GRAPHQL_RELATION_KEY, queries, target);
  };

// queries = {
//   'userFriends': '[User]',
//   'user': 'User'
// }

enum ParamType {
  Parent = "parent",
  Param = "param",
}

export const Parent = (target: any, propertyKey: string, index: number) => {
  let params: any[] =
    Reflect.getMetadata(GRAPHQL_PARAM_KEY, target, propertyKey) || [];

  params.unshift({
    type: ParamType.Parent,
  });
  Reflect.defineMetadata(GRAPHQL_PARAM_KEY, params, target, propertyKey);
};

export const Param =
  (name: string) => (target: any, propertyKey: string, index: number) => {
    let params: any[] =
      Reflect.getMetadata(GRAPHQL_PARAM_KEY, target, propertyKey) || [];

    params.unshift({
      type: ParamType.Param,
      name,
    });
    Reflect.defineMetadata(GRAPHQL_PARAM_KEY, params, target, propertyKey);
  };

export const Auth = (target: any, method: string) => {
  Reflect.defineMetadata(GRAPHQL_AUTH_KEY, true, target, method);
};
