import { Model, Schema } from "mongoose";
import { container } from "./DI-IoC";
import { APP_KEY, GRAPHQL_PARAM_KEY, GRAPHQL_RESOLVE_KEY } from "./key";
import { AppData } from ".";
import { ApolloServer } from "@apollo/server";
import { BaseContext } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

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
}

export const GraphQLServer = (options: GraphQLServerOptions): any => {
  return (target: any) => {
    return class extends target {
      server: ApolloServer<BaseContext>;
      constructor() {
        super();

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
        }
        // 'user(name: String): User'

        // console.log(_queries);
        this.server = new ApolloServer({
          typeDefs: `
            ${_types}

            type Query {
              ${_queries}
            }
          `,
          resolvers: {
            Query: _resolvers,
          },
        });
      }

      async start() {
        const { app }: AppData = container.resolve(APP_KEY);
        await this.server.start();
        app.use(options.url || "/graphql", expressMiddleware(this.server));

        if (options.playground) {
          app.get(options.playground, (req, res) => {
            res.write(`<!DOCTYPE html >
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

export const GraphQL = (model: Model<any>): any => {
  return (target: any) => {
    return class extends target {
      getType() {
        let tree = (model.schema as any).tree;

        let fields = "";

        for (let i in tree) {
          if (map.has(tree[i]?.type || tree[i])) {
            fields += `\n${i}: ${map.get(tree[i]?.type || tree[i])}`;
          }
        }

        return `
          type ${model.modelName} {
            ${fields}
          }
        `;
      }

      getResolver() {
        let queries = Reflect.getMetadata(GRAPHQL_RESOLVE_KEY, this);
        let results: any = {};

        for (let name in queries) {
          results[name] = (parent: any, args: any, context: any, info: any) => {
            let _p: any[] = [parent, args, context, info];
            let params: any[] = Reflect.getMetadata(
              GRAPHQL_PARAM_KEY,
              this,
              name
            );
            if (Array.isArray(params)) {
              for (let i = params.length; i >= 0; i--) {
                let item = params[i];
                if (item.type === ParamType.Parent) {
                  _p.unshift(parent);
                } else {
                  _p.unshift(args[item.name]);
                }
              }
            }

            return this[name].apply(this, _p);
          };
        }

        return results;
      }

      getQuery() {
        let queries = Reflect.getMetadata(GRAPHQL_RESOLVE_KEY, this);
        let str = "";
        for (let name in queries) {
          let params: any[] = Reflect.getMetadata(
            GRAPHQL_PARAM_KEY,
            this,
            name
          );
          let _pStr = "";
          if (params) {
            _pStr = `(${params
              .filter((e) => e.type === ParamType.Param)
              .map((e) => `${e.name}: String`)
              .join(",")})`;
          }

          str += `\n${name}${_pStr}: ${queries[name]}`;
        }
        return str;
      }
    };
  };
};

export const Resolve =
  (type: string) =>
  (target: any, propertyKey: string, descriptor: any): any => {
    let queries = Reflect.getMetadata(GRAPHQL_RESOLVE_KEY, target) || {};
    queries[propertyKey] = type;
    Reflect.defineMetadata(GRAPHQL_RESOLVE_KEY, queries, target);
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

// function a(...args: any[]) {
//   console.log("a", this.abc, ...args);
// }

// let a1 = a.bind({ abc: "a1" });
// // a1(1,2,3,4,56)

// a.apply({ abc: "a1" }, [1, 2, 3, 4, 56]);

// (content: String!)
